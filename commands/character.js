const axios = require('axios');
module.exports = {
    name: 'character',
    description: "Cherche un personnage d'anime/manga : .character Naruto",
    async execute({ sock, m, from, args }) {
        const query = args.join(' ');
        if (!query) return sock.sendMessage(from, { text: '⚠️ Donne un nom : .character <nom>' }, { quoted: m });
        try {
            const { data } = await axios.get('https://api.jikan.moe/v4/characters', { params: { q: query, limit: 1 } });
            const c = data?.data?.[0];
            if (!c) return sock.sendMessage(from, { text: '❌ Aucun résultat.' }, { quoted: m });
            await sock.sendMessage(from, { image: { url: c.images.jpg.image_url }, caption: `${c.name}\n${(c.about || '').slice(0, 500)}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
