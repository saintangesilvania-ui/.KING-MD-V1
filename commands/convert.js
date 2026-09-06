const sharp = require('sharp');
const { bufferFromMessage, getMediaMessage } = require('../lib/media');

module.exports = {
    name: 'convert',
    description: "Convertit une image en un autre format : .convert png (réponds à une image)",
    async execute({ sock, m, from, args }) {
        const format = (args[0] || 'png').toLowerCase();
        if (!['png', 'jpeg', 'webp'].includes(format)) return sock.sendMessage(from, { text: '⚠️ Formats : png, jpeg, webp' }, { quoted: m });
        const media = getMediaMessage(m);
        if (!media || media.type !== 'image') return sock.sendMessage(from, { text: '⚠️ Réponds à une image.' }, { quoted: m });
        try {
            const buffer = await bufferFromMessage(media.message, 'image');
            const converted = await sharp(buffer)[format]().toBuffer();
            await sock.sendMessage(from, { document: converted, fileName: `image.${format}`, mimetype: `image/${format}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
