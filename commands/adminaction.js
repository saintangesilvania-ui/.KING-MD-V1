const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'adminaction',
    description: "Notifie le owner à chaque action admin (kick/ban/promote...) : .adminaction on / off",
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ Notifications admin : ${getSettings().adminaction ? 'activées' : 'désactivées'}` }, { quoted: m });
        }
        setSettings({ adminaction: state === 'on' });
        await sock.sendMessage(from, { text: `✅ ${state === 'on' ? 'Activées' : 'Désactivées'}.` }, { quoted: m });
    },
};
