const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'description',
    description: 'Change la description du bot : .description <valeur>',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const value = args.join(' ');
        if (!value) {
            return sock.sendMessage(from, { text: `ℹ️ Valeur actuelle : ${getSettings().description || '(vide)'}` }, { quoted: m });
        }
        setSettings({ description: value });
        await sock.sendMessage(from, { text: '✅ Mis à jour.' }, { quoted: m });
    },
};
