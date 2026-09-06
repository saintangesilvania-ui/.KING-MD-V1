const { isOwner } = require('../lib/permissions');

module.exports = {
    name: 'invite',
    description: "Invite un numéro dans le groupe actuel : .invite 50912345678",
    async execute({ sock, m, from, args }) {
        const { checkGroupPermissions } = require('../lib/groupHelpers');
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const number = (args[0] || '').replace(/[^0-9]/g, '');
        if (!number) return sock.sendMessage(from, { text: '⚠️ Donne un numéro : .invite 50912345678' }, { quoted: m });
        try {
            await sock.groupParticipantsUpdate(from, [`${number}@s.whatsapp.net`], 'add');
            await sock.sendMessage(from, { text: '✅ Invitation envoyée.' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Impossible d'ajouter directement (ajoute-le manuellement) : ${error.message}` }, { quoted: m });
        }
    },
};
