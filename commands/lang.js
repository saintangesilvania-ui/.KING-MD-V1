const { isOwner } = require('../lib/permissions');
const { getConfig, setConfig } = require('../lib/config');
const { t, SUPPORTED } = require('../lib/i18n');

const NOMS = { fr: 'Français', en: 'English', es: 'Español' };

module.exports = {
    name: 'lang',
    description: 'Change la langue du bot : .lang fr / .lang en / .lang es',
    async execute({ sock, m, from, args }) {
        const senderJid = m.key.participant || from;
        if (!isOwner(senderJid)) {
            return sock.sendMessage(from, { text: t('ownerOnly') }, { quoted: m });
        }
        const choice = args[0]?.toLowerCase();
        if (!SUPPORTED.includes(choice)) {
            const current = getConfig().lang || 'fr';
            return sock.sendMessage(
                from,
                { text: `ℹ️ Langue actuelle : ${NOMS[current]}\nDisponibles : ${SUPPORTED.map((l) => `.lang ${l}`).join('  ')}` },
                { quoted: m }
            );
        }
        setConfig({ lang: choice });
        await sock.sendMessage(from, { text: `✅ ${NOMS[choice]} / Language changed / Idioma cambiado` }, { quoted: m });
    },
};
