const { checkGroupPermissions, extractTarget } = require('../lib/groupHelpers');
const { resetWarnings } = require('../lib/groupSettings');

module.exports = {
    name: 'resetwarn',
    description: "Remet à zéro les avertissements d'un membre",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const target = extractTarget(m);
        if (!target) return sock.sendMessage(from, { text: '⚠️ Mentionne la personne ou réponds à son message.' }, { quoted: m });

        resetWarnings(from, target.replace(/[^0-9]/g, ''));
        await sock.sendMessage(from, { text: '✅ Avertissements remis à zéro.' }, { quoted: m });
    },
};
