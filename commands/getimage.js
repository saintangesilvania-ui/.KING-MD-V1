const { bufferFromMessage, getMediaMessage } = require('../lib/media');

module.exports = {
    name: 'getimage',
    description: "Renvoie l'image d'un sticker (réponds à un sticker)",
    async execute({ sock, m, from }) {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted?.stickerMessage) return sock.sendMessage(from, { text: '⚠️ Réponds à un sticker.' }, { quoted: m });
        try {
            const buffer = await bufferFromMessage(quoted.stickerMessage, 'sticker');
            await sock.sendMessage(from, { image: buffer }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
