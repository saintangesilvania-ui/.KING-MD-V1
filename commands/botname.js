const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'botname',
    description: 'Change le nom affiché du bot dans les infos : .botname <valeur>',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const value = args.join(' ');
        if (!value) {
            return sock.sendMessage(from, { text: `ℹ️ Valeur actuelle : ${getSettings().botName || '(vide)'}` }, { quoted: m });
        }
        setSettings({ botName: value });
        await sock.sendMessage(from, { text: '✅ Mis à jour.' }, { quoted: m });
    },
};
