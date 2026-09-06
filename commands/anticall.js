const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'anticall',
    description: 'Rejette automatiquement les appels reçus : .anticall on / .anticall off',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ Anti-call : ${getSettings().anticall ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setSettings({ anticall: state === 'on' });
        await sock.sendMessage(from, { text: `✅ Anti-call ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
