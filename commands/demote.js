const { checkGroupPermissions, extractTarget } = require('../lib/groupHelpers');

module.exports = {
    name: 'demote',
    description: "Retire les droits admin (réponds à son message ou mentionne-le)",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const target = extractTarget(m);
        if (!target) {
            return sock.sendMessage(from, { text: '⚠️ Mentionne la personne ou réponds à son message.' }, { quoted: m });
        }

        await sock.groupParticipantsUpdate(from, [target], 'demote');
        await sock.sendMessage(from, { text: `✅ Droits admin retirés.` }, { quoted: m });
    },
};
