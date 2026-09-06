const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'mode',
    description: 'Change le mode du bot : .mode public / .mode private',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const value = args[0]?.toLowerCase();
        if (value !== 'public' && value !== 'private') {
            return sock.sendMessage(from, { text: `ℹ️ Mode actuel : ${getSettings().mode}\nUtilise .mode public ou .mode private` }, { quoted: m });
        }
        setSettings({ mode: value });
        await sock.sendMessage(from, { text: `✅ Mode : ${value}` }, { quoted: m });
    },
};
