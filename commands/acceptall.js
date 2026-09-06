const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'acceptall',
    description: "Accepte toutes les demandes d'adhésion en attente",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        try {
            const requests = await sock.groupRequestParticipantsList(from);
            if (!requests.length) return sock.sendMessage(from, { text: 'ℹ️ Aucune demande en attente.' }, { quoted: m });
            await sock.groupRequestParticipantsUpdate(from, requests.map((r) => r.jid), 'approve');
            await sock.sendMessage(from, { text: `✅ ${requests.length} demande(s) acceptée(s).` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
