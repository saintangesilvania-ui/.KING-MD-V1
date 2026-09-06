const { isOwner } = require('../lib/permissions');

module.exports = {
    name: 'setname',
    description: 'Change le nom du bot sur WhatsApp (owner uniquement) : .setname King Bot',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé au propriétaire du bot.' }, { quoted: m });
        }
        const newName = args.join(' ');
        if (!newName) {
            return sock.sendMessage(from, { text: '⚠️ Donne un nom : .setname King Bot' }, { quoted: m });
        }
        await sock.updateProfileName(newName);
        await sock.sendMessage(from, { text: `✅ Nom du bot changé pour : ${newName}` }, { quoted: m });
    },
};
