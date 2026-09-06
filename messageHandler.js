const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { getConfig } = require('./lib/config');
const { isToggled } = require('./lib/groupSettings');
const { isGroup, getGroupAdmins } = require('./lib/groupHelpers');
const { bufferFromMessage } = require('./lib/media');

const commands = new Map();
const commandsDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsDir)) {
    if (!file.endsWith('.js')) continue;
    const cmd = require(path.join(commandsDir, file));
    if (cmd?.name && typeof cmd.execute === 'function') {
        commands.set(cmd.name, cmd);
        for (const alias of cmd.aliases || []) commands.set(alias, cmd);
    }
}
console.log(`🔧 ${commands.size} commande(s) chargée(s) : ${[...new Set([...commands.values()].map(c => c.name))].join(', ')}`);

const LINK_REGEX = /(https?:\/\/|chat\.whatsapp\.com|wa\.me)/i;
const lastMessageBySender = new Map();

async function runGroupFilters(sock, m, from, body) {
    const sender = m.key.participant;

    let admins = [];
    try {
        admins = await getGroupAdmins(sock, from);
    } catch {
        return;
    }
    const senderIsAdmin = admins.includes(sender);

    if (!senderIsAdmin && isToggled(from, 'antilink') && LINK_REGEX.test(body)) {
        try {
            await sock.sendMessage(from, { delete: { remoteJid: from, id: m.key.id, participant: sender, fromMe: false } });
            await sock.sendMessage(from, { text: `🚫 Lien supprimé (anti-lien actif). @${sender.split('@')[0]}`, mentions: [sender] });
        } catch (e) { console.error('antilink:', e.message); }
        return true;
    }

    const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!senderIsAdmin && isToggled(from, 'antitag') && mentions.length >= 5) {
        try {
            await sock.sendMessage(from, { delete: { remoteJid: from, id: m.key.id, participant: sender, fromMe: false } });
        } catch (e) { console.error('antitag:', e.message); }
        return true;
    }

    if (!senderIsAdmin && isToggled(from, 'antispam')) {
        const key = `${from}:${sender}`;
        const now = Date.now();
        const history = (lastMessageBySender.get(key) || []).filter((t) => now - t < 10000);
        history.push(now);
        lastMessageBySender.set(key, history);
        if (history.length > 5) {
            await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]}, ralentis un peu (anti-spam).`, mentions: [sender] });
            lastMessageBySender.set(key, []);
        }
    }

    if (isToggled(from, 'autoreact')) {
        const emojis = ['👍', '🔥', '😂', '❤️', '👀'];
        try {
            await sock.sendMessage(from, {
                react: { text: emojis[Math.floor(Math.random() * emojis.length)], key: m.key },
            });
        } catch (e) {}
    }

    if (isToggled(from, 'autosticker') && m.message.imageMessage) {
        try {
            const buffer = await bufferFromMessage(m.message.imageMessage, 'image');
            const webp = await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp().toBuffer();
            await sock.sendMessage(from, { sticker: webp });
        } catch (e) { console.error('autosticker:', e.message); }
    }

    return false;
}

async function handleMessage(sock, m) {
    const from = m.key.remoteJid;
    const body =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        m.message.imageMessage?.caption ||
        '';

    if (isGroup(from) && !m.key.fromMe) {
        const handled = await runGroupFilters(sock, m, from, body);
        if (handled) return;
    }

    const { getGame, playMove } = require('./lib/ticTacToe');
    const trimmedBody = body.trim();
    if (/^[1-9]$/.test(trimmedBody) && getGame(from)) {
        const player = m.key.participant || from;
        const result = playMove(from, player, parseInt(trimmedBody, 10) - 1);
        if (result.error) {
            await sock.sendMessage(from, { text: `⚠️ ${result.error}` }, { quoted: m });
        } else if (result.draw) {
            await sock.sendMessage(from, { text: `${result.board}\n\n🤝 Match nul !` });
        } else if (result.winner) {
            await sock.sendMessage(from, { text: `${result.board}\n\n🏆 @${result.winner.split('@')[0]} a gagné !`, mentions: [result.winner] });
        } else {
            await sock.sendMessage(from, { text: `${result.board}\n\n@${result.nextTurn.split('@')[0]}, à toi !`, mentions: [result.nextTurn] });
        }
        return;
    }

    const { hasPending, cancelPending } = require('./lib/pendingActions');
    const sender = m.key.participant || from;
    if (trimmedBody.toLowerCase() === 'stop' && hasPending(from, sender)) {
        cancelPending(from, sender);
        await sock.sendMessage(from, { text: '🛑 Purge annulée.' }, { quoted: m });
        return;
    }

    const prefix = getConfig().prefix || '.';
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (!command) return;

    try {
        await command.execute({ sock, m, from, args });
    } catch (err) {
        console.error(`Erreur dans la commande "${commandName}":`, err);
        await sock.sendMessage(from, { text: `❌ Erreur lors de l'exécution de ${prefix}${commandName}` }, { quoted: m });
    }
}

module.exports = { handleMessage, commands };
