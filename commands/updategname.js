const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'updategname',
    description: 'Change le nom du groupe : .updategname Nouveau nom',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const name = args.join(' ');
        if (!name) return sock.sendMessage(from, { text: '⚠️ Donne un nom.' }, { quoted: m });
        await sock.groupUpdateSubject(from, name);
        await sock.sendMessage(from, { text: '✅ Nom du groupe mis à jour.' }, { quoted: m });
    },
};
