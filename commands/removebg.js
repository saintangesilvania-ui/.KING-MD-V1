const axios = require('axios');
const FormData = require('form-data');
const { bufferFromMessage, getMediaMessage } = require('../lib/media');

module.exports = {
    name: 'removebg',
    description: "Enlève le fond d'une image (réponds à une image) — nécessite REMOVEBG_API_KEY",
    async execute({ sock, m, from }) {
        const apiKey = process.env.REMOVEBG_API_KEY;
        if (!apiKey) return sock.sendMessage(from, { text: '❌ REMOVEBG_API_KEY manquant dans les variables d\'environnement.' }, { quoted: m });
        const media = getMediaMessage(m);
        if (!media || media.type !== 'image') return sock.sendMessage(from, { text: '⚠️ Réponds à une image.' }, { quoted: m });
        try {
            const buffer = await bufferFromMessage(media.message, 'image');
            const form = new FormData();
            form.append('image_file', buffer, 'image.jpg');
            form.append('size', 'auto');
            const res = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
                headers: { ...form.getHeaders(), 'X-Api-Key': apiKey },
                responseType: 'arraybuffer',
            });
            await sock.sendMessage(from, { image: Buffer.from(res.data) }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
