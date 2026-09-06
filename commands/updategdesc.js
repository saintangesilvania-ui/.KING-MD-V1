const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'updategdesc',
    description: 'Change la description du groupe : .updategdesc <texte>',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const desc = args.join(' ');
        if (!desc) return sock.sendMessage(from, { text: '⚠️ Donne une description.' }, { quoted: m });
        await sock.groupUpdateDescription(from, desc);
        await sock.sendMessage(from, { text: '✅ Description mise à jour.' }, { quoted: m });
    },
};
