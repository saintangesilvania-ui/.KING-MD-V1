const { isOwner } = require('../lib/permissions');
const { isGroup } = require('../lib/groupHelpers');

module.exports = {
    name: 'out',
    description: 'Le bot quitte le groupe (owner uniquement)',
    async execute({ sock, m, from }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        if (!isGroup(from)) return sock.sendMessage(from, { text: '⚠️ Marche seulement dans un groupe.' }, { quoted: m });
        await sock.sendMessage(from, { text: '👋 À bientôt !' });
        await sock.groupLeave(from);
    },
};
