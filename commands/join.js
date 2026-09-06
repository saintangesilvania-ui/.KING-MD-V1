const { isOwner } = require('../lib/permissions');

module.exports = {
    name: 'join',
    description: "Rejoint un groupe via son lien d'invitation : .join <lien>",
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const link = args[0];
        const code = link?.split('chat.whatsapp.com/')[1];
        if (!code) return sock.sendMessage(from, { text: '⚠️ Lien invalide : .join https://chat.whatsapp.com/xxxx' }, { quoted: m });
        try {
            await sock.groupAcceptInvite(code.split('?')[0]);
            await sock.sendMessage(from, { text: '✅ Groupe rejoint.' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
