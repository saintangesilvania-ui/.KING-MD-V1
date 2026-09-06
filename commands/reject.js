const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'reject',
    description: "Rejette une demande d'adhésion précise : .reject 50912345678",
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const number = (args[0] || '').replace(/[^0-9]/g, '');
        if (!number) return sock.sendMessage(from, { text: '⚠️ Donne un numéro.' }, { quoted: m });
        await sock.groupRequestParticipantsUpdate(from, [`${number}@s.whatsapp.net`], 'reject');
        await sock.sendMessage(from, { text: '✅ Rejeté.' }, { quoted: m });
    },
};
