const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'recording',
    description: 'Active/désactive recording : .recording on / .recording off',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ recording : ${getSettings().recording ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setSettings({ recording: state === 'on' });
        await sock.sendMessage(from, { text: `✅ recording ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
