const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'hidetag',
    description: 'Notifie tout le groupe sans afficher la liste des membres (admin uniquement) : .hidetag <message>',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const metadata = await sock.groupMetadata(from);
        const participants = metadata.participants.map((p) => p.id);
        const text = args.join(' ') || '📢';

        // Les mentions sont dans "mentions" mais pas affichées dans le texte
        await sock.sendMessage(from, { text, mentions: participants }, { quoted: m });
    },
};
