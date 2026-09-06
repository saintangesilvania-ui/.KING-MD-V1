const axios = require('axios');

// Nécessite IMAGE_API_URL + IMAGE_API_KEY dans les variables d'environnement
// (ex: endpoint compatible OpenAI Images ou un autre générateur d'images).
module.exports = {
    name: 'imagine',
    description: "Génère une image à partir d'une description : .imagine un chat astronaute",
    async execute({ sock, m, from, args }) {
        const prompt = args.join(' ');
        if (!prompt) return sock.sendMessage(from, { text: '⚠️ Décris ce que tu veux voir : .imagine <description>' }, { quoted: m });

        const apiUrl = process.env.IMAGE_API_URL;
        const apiKey = process.env.IMAGE_API_KEY;
        if (!apiUrl || !apiKey) {
            return sock.sendMessage(from, { text: "❌ Aucune clé de génération d'image configurée (IMAGE_API_URL / IMAGE_API_KEY manquants sur Render)." }, { quoted: m });
        }

        try {
            await sock.sendMessage(from, { text: '🎨 Génération en cours...' }, { quoted: m });
            const { data } = await axios.post(
                apiUrl,
                { prompt, n: 1, size: '1024x1024' },
                { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 60000 }
            );
            const imageUrl = data?.data?.[0]?.url;
            if (!imageUrl) throw new Error('Réponse inattendue de l\'API image.');
            await sock.sendMessage(from, { image: { url: imageUrl }, caption: prompt }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Échec de la génération : ${error.message}` }, { quoted: m });
        }
    },
};
