const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'online',
    description: 'Statut "toujours en ligne" : .online on / .online off',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ Statut "toujours en ligne" : ${getSettings().online ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setSettings({ online: state === 'on' });
        await sock.sendMessage(from, { text: `✅ Statut "toujours en ligne" ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
