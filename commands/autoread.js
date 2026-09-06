const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'autoread',
    description: 'Active/désactive autoread : .autoread on / .autoread off',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ autoread : ${getSettings().autoread ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setSettings({ autoread: state === 'on' });
        await sock.sendMessage(from, { text: `✅ autoread ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
