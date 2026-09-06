const { checkGroupPermissions, extractTarget } = require('../lib/groupHelpers');
const { addBan } = require('../lib/groupSettings');

module.exports = {
    name: 'ban',
    description: "Bannit un membre (kick + empêche de le laisser réutiliser le bot dans ce groupe)",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const target = extractTarget(m);
        if (!target) return sock.sendMessage(from, { text: '⚠️ Mentionne la personne ou réponds à son message.' }, { quoted: m });

        addBan(from, target.replace(/[^0-9]/g, ''));
        try { await sock.groupParticipantsUpdate(from, [target], 'remove'); } catch {}
        await sock.sendMessage(from, { text: '🔨 Membre banni du groupe.' }, { quoted: m });
    },
};
