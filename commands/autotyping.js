const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'autotyping',
    description: 'Active/désactive autotyping : .autotyping on / .autotyping off',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ autotyping : ${getSettings().autotyping ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setSettings({ autotyping: state === 'on' });
        await sock.sendMessage(from, { text: `✅ autotyping ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
