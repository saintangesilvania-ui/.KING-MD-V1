const { checkGroupPermissions } = require('../lib/groupHelpers');
const { getGroup, updateGroup } = require('../lib/groupSettings');

module.exports = {
    name: 'setgoodbye',
    description: "Personnalise le message de départ : .setgoodbye Au revoir @user",
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: '⚠️ Donne un texte (utilise @user pour mentionner le membre parti).' }, { quoted: m });
        const g = getGroup(from);
        g.goodbyeMessage = text;
        updateGroup(from, g);
        await sock.sendMessage(from, { text: '✅ Message de départ personnalisé.' }, { quoted: m });
    },
};
