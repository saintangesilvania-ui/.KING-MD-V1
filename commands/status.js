const { isOwner, isAdmin, isPremium } = require('../lib/permissions');

module.exports = {
    name: 'status',
    description: 'Affiche ton statut (owner / admin / premium)',
    async execute({ sock, m, from }) {
        const jid = m.key.participant || m.key.remoteJid;
        let role = 'Utilisateur normal';
        if (isOwner(jid)) role = '👑 Propriétaire';
        else if (isAdmin(jid)) role = '🛡️ Admin';
        else if (isPremium(jid)) role = '⭐ Premium';
        await sock.sendMessage(from, { text: `Ton statut : ${role}` }, { quoted: m });
    },
};
