const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'accept',
    description: "Accepte une demande d'adhésion précise : .accept 50912345678",
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const number = (args[0] || '').replace(/[^0-9]/g, '');
        if (!number) return sock.sendMessage(from, { text: '⚠️ Donne un numéro.' }, { quoted: m });
        await sock.groupRequestParticipantsUpdate(from, [`${number}@s.whatsapp.net`], 'approve');
        await sock.sendMessage(from, { text: '✅ Accepté.' }, { quoted: m });
    },
};
