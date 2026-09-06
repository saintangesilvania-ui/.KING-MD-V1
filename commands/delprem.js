const { isAdmin, removePremium } = require('../lib/permissions');

module.exports = {
    name: 'delprem',
    description: 'Retire un membre premium (réservé aux admins)',
    async execute({ sock, m, from, args }) {
        if (!isAdmin(m.key.participant || m.key.remoteJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé aux admins.' }, { quoted: m });
        }
        const target = m.message.extendedTextMessage?.contextInfo?.participant || args[0];
        if (!target) {
            return sock.sendMessage(from, { text: '⚠️ Donne le numéro : .delprem 50912345678' }, { quoted: m });
        }
        const removed = removePremium(target);
        await sock.sendMessage(
            from,
            { text: removed ? `✅ ${target} retiré du premium.` : "ℹ️ N'était pas premium." },
            { quoted: m }
        );
    },
};
