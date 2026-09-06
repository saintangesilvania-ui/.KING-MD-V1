const { askAI } = require('../lib/aiClient');
const { bufferFromMessage, getMediaMessage } = require('../lib/media');

module.exports = {
    name: 'caption',
    description: "Génère une légende créative pour une image (réponds à une image)",
    async execute({ sock, m, from }) {
        const media = getMediaMessage(m);
        if (!media || media.type !== 'image') return sock.sendMessage(from, { text: '⚠️ Réponds à une image.' }, { quoted: m });
        try {
            const text = await askAI('Propose une légende Instagram créative et courte pour une photo (générique, sans voir l\'image).', 'Tu écris des légendes accrocheuses en français.');
            await sock.sendMessage(from, { text: `✏️ ${text}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
