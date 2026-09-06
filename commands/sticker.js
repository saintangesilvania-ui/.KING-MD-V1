const sharp = require('sharp');
const { bufferFromMessage, getMediaMessage } = require('../lib/media');

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    description: "Convertit une image en sticker (réponds à une image avec .sticker)",
    async execute({ sock, m, from }) {
        const media = getMediaMessage(m);
        if (!media) {
            return sock.sendMessage(from, { text: '⚠️ Réponds à une image avec .sticker (les vidéos ne sont pas encore supportées).' }, { quoted: m });
        }
        if (media.type === 'video') {
            return sock.sendMessage(from, { text: '⚠️ Les vidéos ne sont pas encore supportées, seulement les images pour le moment.' }, { quoted: m });
        }

        try {
            const buffer = await bufferFromMessage(media.message, media.type);
            const webpBuffer = await sharp(buffer)
                .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp()
                .toBuffer();

            await sock.sendMessage(from, { sticker: webpBuffer }, { quoted: m });
        } catch (error) {
            console.error('Erreur sticker:', error);
            await sock.sendMessage(from, { text: '❌ Erreur lors de la création du sticker.' }, { quoted: m });
        }
    },
};
