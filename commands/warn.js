const { checkGroupPermissions, extractTarget } = require('../lib/groupHelpers');
const { addWarning } = require('../lib/groupSettings');

const MAX_WARNINGS = 3;

module.exports = {
    name: 'warn',
    description: `Avertit un membre (kick automatique au ${MAX_WARNINGS}e avertissement)`,
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const target = extractTarget(m);
        if (!target) return sock.sendMessage(from, { text: '⚠️ Mentionne la personne ou réponds à son message.' }, { quoted: m });

        const number = target.replace(/[^0-9]/g, '');
        const count = addWarning(from, number);

        if (count >= MAX_WARNINGS) {
            try { await sock.groupParticipantsUpdate(from, [target], 'remove'); } catch {}
            return sock.sendMessage(from, { text: `🚫 ${MAX_WARNINGS} avertissements atteints → membre retiré du groupe.` }, { quoted: m });
        }
        await sock.sendMessage(from, { text: `⚠️ Avertissement ${count}/${MAX_WARNINGS}.` }, { quoted: m });
    },
};
