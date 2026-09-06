const { isAdmin, addPremium } = require('../lib/permissions');

module.exports = {
    name: 'addprem',
    description: 'Ajoute un membre premium (réservé aux admins)',
    async execute({ sock, m, from, args }) {
        if (!isAdmin(m.key.participant || m.key.remoteJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé aux admins.' }, { quoted: m });
        }
        const target = m.message.extendedTextMessage?.contextInfo?.participant || args[0];
        if (!target) {
            return sock.sendMessage(from, { text: '⚠️ Donne le numéro : .addprem 50912345678' }, { quoted: m });
        }
        const added = addPremium(target);
        await sock.sendMessage(
            from,
            { text: added ? `✅ ${target} ajouté en premium.` : 'ℹ️ Déjà premium.' },
            { quoted: m }
        );
    },
};
