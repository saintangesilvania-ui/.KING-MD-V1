const { isOwner, addAdmin } = require('../lib/permissions');

module.exports = {
    name: 'addadmin',
    description: "Ajoute un admin (réservé au propriétaire du bot)",
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé au propriétaire du bot.' }, { quoted: m });
        }
        const target = m.message.extendedTextMessage?.contextInfo?.participant || args[0];
        if (!target) {
            return sock.sendMessage(from, { text: '⚠️ Réponds à un message de la personne ou donne son numéro : .addadmin 50912345678' }, { quoted: m });
        }
        const added = addAdmin(target);
        await sock.sendMessage(
            from,
            { text: added ? `✅ ${target} ajouté comme admin.` : 'ℹ️ Déjà admin.' },
            { quoted: m }
        );
    },
};
