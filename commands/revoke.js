const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'revoke',
    description: "Révoque l'ancien lien d'invitation et en génère un nouveau",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const newCode = await sock.groupRevokeInvite(from);
        await sock.sendMessage(from, { text: `✅ Nouveau lien : https://chat.whatsapp.com/${newCode}` }, { quoted: m });
    },
};
