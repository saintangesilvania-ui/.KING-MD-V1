const path = require('path');
const fs = require('fs');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    Browsers,
    delay,
} = require('@whiskeysockets/baileys');

const { handleMessage } = require('./messageHandler');
const { isToggled } = require('./lib/groupSettings');
const { encodeSession, restoreSession } = require('./lib/sessionString');
const { sendConnectionMessage, sendConnectionConfirmation } = require('./lib/connectionMessage');

const SESSION_BASE_PATH = path.join(__dirname, 'session');
if (!fs.existsSync(SESSION_BASE_PATH)) fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });

// Durée pendant laquelle un code d'appairage reste valide côté WhatsApp.
const PAIRING_WINDOW_MS = 120000;
const QR_TIMEOUT_MS = 30000;

let pairingLock = null; // { number, startedAt, timer }
let qrInProgress = false;

function pairingActive() {
    return pairingLock !== null;
}

function releasePairingLock() {
    if (pairingLock?.timer) clearTimeout(pairingLock.timer);
    pairingLock = null;
}

function acquirePairingLock(number) {
    pairingLock = {
        number,
        startedAt: Date.now(),
        timer: setTimeout(() => {
            console.warn('⌛ Fenêtre d\'appairage expirée, verrou libéré.');
            pairingLock = null;
        }, PAIRING_WINDOW_MS),
    };
}

function confirmConnection(sock) {
    const fn = sendConnectionConfirmation || sendConnectionMessage;
    if (typeof fn === 'function') {
        try {
            fn(sock);
        } catch (err) {
            console.error('Erreur message de connexion:', err.message);
        }
    }
}

function wireCommonEvents(sock) {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m?.message) return;

        if (m.key.remoteJid?.endsWith('@newsletter') && m.newsletterServerId) {
            const { setConfig } = require('./lib/config');
            setConfig({ lastNewsletterMessageId: String(m.newsletterServerId), lastNewsletterJid: m.key.remoteJid });
        }

        try {
            await handleMessage(sock, m);
        } catch (err) {
            console.error('Erreur handleMessage:', err.message);
        }
    });

    sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
        try {
            const { getGroup } = require('./lib/groupSettings');
            const g = getGroup(id);
            if (action === 'add' && isToggled(id, 'welcome')) {
                for (const jid of participants) {
                    const template = g.welcomeMessage || 'Bienvenue @user dans le groupe !';
                    await sock.sendMessage(id, {
                        text: `👋 ${template.replace('@user', `@${jid.split('@')[0]}`)}`,
                        mentions: [jid],
                    });
                }
            }
            if (action === 'remove' && isToggled(id, 'goodbye')) {
                for (const jid of participants) {
                    const template = g.goodbyeMessage || '@user a quitté le groupe.';
                    await sock.sendMessage(id, {
                        text: `👋 ${template.replace('@user', `@${jid.split('@')[0]}`)}`,
                        mentions: [jid],
                    });
                }
            }
        } catch (err) {
            console.error('Erreur welcome/goodbye:', err.message);
        }
    });

    sock.ev.on('call', async (calls) => {
        const { getSettings } = require('./lib/botSettings');
        const s = getSettings();
        if (!s.anticall) return;
        for (const call of calls) {
            try {
                await sock.rejectCall(call.id, call.from);
                await sock.sendMessage(call.from, { text: s.anticallMessage });
            } catch (err) {
                console.error('Erreur anticall:', err.message);
            }
        }
    });
}

function followOwnerChannel(sock) {
    const { getConfig } = require('./lib/config');
    const newsletterJid = getConfig().newsletterJid;
    if (newsletterJid) {
        sock.newsletterFollow(newsletterJid)
            .then(() => console.log(`📢 Abonné automatiquement au canal ${newsletterJid}`))
            .catch((e) => console.error('Erreur abonnement canal:', e.message));
    }
}

function buildSocket(state, version, browser) {
    return makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        logger: pino({ level: 'silent' }),
        browser,
        syncFullHistory: false,
        markOnlineOnConnect: true,
    });
}

/**
 * Demande un code d'appairage (ou reprend une session existante).
 * Le verrou reste actif jusqu'à la connexion réussie, la fermeture, ou l'expiration
 * de la fenêtre d'appairage : impossible d'invalider un code encore affiché.
 */
async function connectToWhatsApp(number) {
    if (pairingActive()) {
        const left = Math.max(
            1,
            Math.ceil((PAIRING_WINDOW_MS - (Date.now() - pairingLock.startedAt)) / 1000)
        );
        const err = new Error(
            `Un code est déjà actif pour ${pairingLock.number}. Utilise-le, ou réessaie dans ${left} s.`
        );
        err.code = 'PAIRING_IN_PROGRESS';
        throw err;
    }

    const sanitizedNumber = (number || '').replace(/[^0-9]/g, '');
    if (sanitizedNumber.length < 8) {
        throw new Error(`Numéro invalide : "${number}" (n'oublie pas l'indicatif pays, sans le +)`);
    }

    acquirePairingLock(sanitizedNumber);

    try {
        const sessionPath = path.join(SESSION_BASE_PATH, sanitizedNumber);

        // Restauration éventuelle depuis SESSION_ID avant toute lecture d'état.
        if (!fs.existsSync(path.join(sessionPath, 'creds.json'))) {
            if (process.env.SESSION_ID && process.env.SESSION_NUMBER === sanitizedNumber) {
                if (restoreSession(sessionPath, process.env.SESSION_ID)) {
                    console.log(`♻️ Session restaurée depuis SESSION_ID pour ${sanitizedNumber}`);
                }
            }
        }

        // Une session non enregistrée est inutilisable : on repart d'un dossier propre
        // AVANT d'ouvrir l'état (une seule ouverture ensuite, pas de fichiers à moitié écrits).
        let resume = false;
        if (fs.existsSync(path.join(sessionPath, 'creds.json'))) {
            try {
                const creds = JSON.parse(fs.readFileSync(path.join(sessionPath, 'creds.json'), 'utf8'));
                resume = Boolean(creds?.registered);
            } catch {
                resume = false;
            }
        }
        if (!resume) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }
        fs.mkdirSync(sessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const { version } = await fetchLatestBaileysVersion();
        console.log(`📶 Baileys / WA version : ${version.join('.')}`);

        const sock = buildSocket(
            state,
            version,
            Browsers.ubuntu('Chrome')
        );

        sock.ev.on('creds.update', saveCreds);
        wireCommonEvents(sock);

        // Reprise d'une session déjà appairée : rien à afficher.
        if (resume) {
            sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
                if (connection === 'open') {
                    console.log('✅ Reconnecté à WhatsApp !');
                    releasePairingLock();
                    followOwnerChannel(sock);
                    confirmConnection(sock);
                } else if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    console.warn(`❌ Connexion fermée (code ${statusCode})`);
                    releasePairingLock();
                    if (statusCode !== 401) {
                        setTimeout(() => connectToWhatsApp(sanitizedNumber).catch(console.error), 5000);
                    }
                }
            });
            return null;
        }

        // Nouvel appairage : on attend que la socket soit réellement en cours de
        // connexion avant de demander le code (un délai fixe donne des codes invalides
        // sur les hébergeurs lents).
        return await new Promise((resolve, reject) => {
            let requested = false;
            let settled = false;

            const guard = setTimeout(() => {
                if (settled) return;
                settled = true;
                releasePairingLock();
                reject(new Error("Aucun code reçu de WhatsApp à temps, réessaie dans quelques secondes."));
            }, 30000);

            const askCode = async () => {
                if (requested) return;
                requested = true;
                try {
                    await delay(800);
                    const code = await sock.requestPairingCode(sanitizedNumber);
                    if (settled) return;
                    settled = true;
                    clearTimeout(guard);
                    console.log(`🔑 Code d'appairage généré pour ${sanitizedNumber}`);
                    resolve(code?.match(/.{1,4}/g)?.join('-') || code);
                } catch (err) {
                    if (settled) return;
                    settled = true;
                    clearTimeout(guard);
                    releasePairingLock();
                    reject(err);
                }
            };

            sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect, qr } = update;

                if ((connection === 'connecting' || qr) && !sock.authState.creds.registered) {
                    askCode();
                }

                if (connection === 'open') {
                    console.log('✅ Connecté à WhatsApp (pairing code) !');
                    releasePairingLock();
                    followOwnerChannel(sock);
                    confirmConnection(sock);
                    try {
                        const sessionId = encodeSession(sessionPath);
                        if (sessionId) console.log('💾 SESSION_ID prêt (commande .getsession).');
                    } catch {}
                }

                if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    console.warn(`❌ Connexion fermée (code ${statusCode})`);
                    // 401/403 = code refusé ou session révoquée : on libère tout de suite.
                    if (statusCode === 401 || statusCode === 403) {
                        releasePairingLock();
                        if (!settled) {
                            settled = true;
                            clearTimeout(guard);
                            reject(new Error('WhatsApp a refusé cette session, relance une nouvelle demande.'));
                        }
                        return;
                    }
                    // 515 = redémarrage normal juste après l'appairage.
                    if (sock.authState.creds.registered) {
                        setTimeout(() => {
                            releasePairingLock();
                            connectToWhatsApp(sanitizedNumber).catch(console.error);
                        }, 4000);
                    }
                }
            });
        });
    } catch (error) {
        releasePairingLock();
        throw error;
    }
}

async function connectViaQR() {
    if (qrInProgress) {
        throw new Error('Une génération de QR est déjà en cours, patiente quelques secondes.');
    }
    qrInProgress = true;

    try {
        const sessionPath = path.join(SESSION_BASE_PATH, '_qrsession');
        fs.rmSync(sessionPath, { recursive: true, force: true });
        fs.mkdirSync(sessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const { version } = await fetchLatestBaileysVersion();

        return await new Promise((resolve, reject) => {
            const sock = buildSocket(state, version, Browsers.ubuntu('Chrome'));

            sock.ev.on('creds.update', saveCreds);
            wireCommonEvents(sock);

            let settled = false;
            const timeout = setTimeout(() => {
                if (settled) return;
                settled = true;
                qrInProgress = false;
                reject(new Error('Délai dépassé, aucun QR reçu.'));
            }, QR_TIMEOUT_MS);

            sock.ev.on('connection.update', (update) => {
                if (update.qr && !settled) {
                    settled = true;
                    clearTimeout(timeout);
                    qrInProgress = false;
                    resolve(update.qr);
                }
                if (update.connection === 'open') {
                    console.log('✅ Connecté à WhatsApp (QR code) !');
                    qrInProgress = false;
                    followOwnerChannel(sock);
                    confirmConnection(sock);
                }
                if (update.connection === 'close') {
                    qrInProgress = false;
                }
            });
        });
    } catch (error) {
        qrInProgress = false;
        throw error;
    }
}

module.exports = { connectToWhatsApp, connectViaQR, pairingActive };
