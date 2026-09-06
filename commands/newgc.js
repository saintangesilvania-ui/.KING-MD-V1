const { isOwner } = require('../lib/permissions');

module.exports = {
    name: 'newgc',
    description: 'Crée un nouveau groupe : .newgc Nom du groupe',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const name = args.join(' ');
        if (!name) return sock.sendMessage(from, { text: '⚠️ Donne un nom : .newgc Nom du groupe' }, { quoted: m });
        const group = await sock.groupCreate(name, []);
        await sock.sendMessage(from, { text: `✅ Groupe créé : ${group.id}` }, { quoted: m });
    },
};
