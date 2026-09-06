const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'requests',
    description: "Liste les demandes d'adhésion en attente",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const requests = await sock.groupRequestParticipantsList(from);
        if (!requests.length) return sock.sendMessage(from, { text: 'ℹ️ Aucune demande en attente.' }, { quoted: m });
        const text = requests.map((r) => `▸ @${r.jid.split('@')[0]}`).join('\n');
        await sock.sendMessage(from, { text: `📋 Demandes en attente :\n${text}`, mentions: requests.map((r) => r.jid) }, { quoted: m });
    },
};
