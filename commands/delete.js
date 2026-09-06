const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'delete',
    aliases: ['del'],
    description: "Supprime un message pour tout le monde (réponds au message à supprimer)",
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const contextInfo = m.message.extendedTextMessage?.contextInfo;
        if (!contextInfo?.stanzaId) {
            return sock.sendMessage(from, { text: '⚠️ Réponds au message que tu veux supprimer avec .delete' }, { quoted: m });
        }

        await sock.sendMessage(from, {
            delete: {
                remoteJid: from,
                id: contextInfo.stanzaId,
                participant: contextInfo.participant,
            },
        });
    },
};
