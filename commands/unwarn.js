const { checkGroupPermissions, extractTarget } = require('../lib/groupHelpers');
const { removeWarning } = require('../lib/groupSettings');

module.exports = {
    name: 'unwarn',
    description: "Retire un avertissement à un membre",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const target = extractTarget(m);
        if (!target) return sock.sendMessage(from, { text: '⚠️ Mentionne la personne ou réponds à son message.' }, { quoted: m });

        const count = removeWarning(from, target.replace(/[^0-9]/g, ''));
        await sock.sendMessage(from, { text: `✅ Avertissement retiré (${count} restant(s)).` }, { quoted: m });
    },
};
