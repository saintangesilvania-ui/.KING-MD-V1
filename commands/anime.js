const axios = require('axios');
module.exports = {
    name: 'anime',
    description: 'Cherche un anime : .anime One Piece',
    async execute({ sock, m, from, args }) {
        const query = args.join(' ');
        if (!query) return sock.sendMessage(from, { text: '⚠️ Donne un titre : .anime <titre>' }, { quoted: m });
        try {
            const { data } = await axios.get('https://api.jikan.moe/v4/anime', { params: { q: query, limit: 1 } });
            const a = data?.data?.[0];
            if (!a) return sock.sendMessage(from, { text: '❌ Aucun résultat.' }, { quoted: m });
            await sock.sendMessage(from, { image: { url: a.images.jpg.image_url }, caption: `${a.title}\n⭐ ${a.score || '?'}/10\n${(a.synopsis || '').slice(0, 400)}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
