const { isOwner, removeAdmin } = require('../lib/permissions');

module.exports = {
    name: 'deladmin',
    description: "Retire un admin (réservé au propriétaire du bot)",
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé au propriétaire du bot.' }, { quoted: m });
        }
        const target = m.message.extendedTextMessage?.contextInfo?.participant || args[0];
        if (!target) {
            return sock.sendMessage(from, { text: '⚠️ Donne le numéro : .deladmin 50912345678' }, { quoted: m });
        }
        const removed = removeAdmin(target);
        await sock.sendMessage(
            from,
            { text: removed ? `✅ ${target} retiré des admins.` : "ℹ️ N'était pas admin." },
            { quoted: m }
        );
    },
};
