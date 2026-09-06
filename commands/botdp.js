const fs = require('fs');
const { isOwner } = require('../lib/permissions');
const { bufferFromMessage, getMediaMessage } = require('../lib/media');

module.exports = {
    name: 'botdp',
    description: 'Change la photo de profil du bot (réponds à une image avec .botdp)',
    async execute({ sock, m, from }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const media = getMediaMessage(m);
        if (!media || media.type !== 'image') return sock.sendMessage(from, { text: '⚠️ Réponds à une image avec .botdp' }, { quoted: m });
        try {
            const buffer = await bufferFromMessage(media.message, 'image');
            await sock.updateProfilePicture(sock.user.id, buffer);
            await sock.sendMessage(from, { text: '✅ Photo de profil mise à jour.' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Échec : ${error.message}` }, { quoted: m });
        }
    },
};
