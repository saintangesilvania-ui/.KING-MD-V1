const axios = require('axios');
const FormData = require('form-data');
const { bufferFromMessage, getMediaMessage } = require('../lib/media');

// Nécessite IMAGE_TOOLS_API_URL + IMAGE_TOOLS_API_KEY (endpoint compatible, à toi de choisir un fournisseur).
module.exports = {
    name: 'enhance',
    description: "Traite une image (enhance) — réponds à une image — nécessite IMAGE_TOOLS_API_URL/KEY",
    async execute({ sock, m, from }) {
        const apiUrl = process.env.IMAGE_TOOLS_API_URL;
        const apiKey = process.env.IMAGE_TOOLS_API_KEY;
        if (!apiUrl || !apiKey) return sock.sendMessage(from, { text: '❌ IMAGE_TOOLS_API_URL / IMAGE_TOOLS_API_KEY manquants.' }, { quoted: m });
        const media = getMediaMessage(m);
        if (!media || media.type !== 'image') return sock.sendMessage(from, { text: '⚠️ Réponds à une image.' }, { quoted: m });
        try {
            const buffer = await bufferFromMessage(media.message, 'image');
            const form = new FormData();
            form.append('image', buffer, 'image.jpg');
            form.append('operation', 'enhance');
            const res = await axios.post(apiUrl, form, {
                headers: { ...form.getHeaders(), Authorization: `Bearer ${apiKey}` },
                responseType: 'arraybuffer',
            });
            await sock.sendMessage(from, { image: Buffer.from(res.data) }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
