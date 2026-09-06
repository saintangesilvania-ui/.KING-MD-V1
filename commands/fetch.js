const axios = require('axios');

module.exports = {
    name: 'fetch',
    description: "Vérifie qu'un lien répond et affiche son statut : .fetch https://exemple.com",
    async execute({ sock, m, from, args }) {
        const url = args[0];
        if (!url || !url.startsWith('http')) return sock.sendMessage(from, { text: '⚠️ Donne un lien : .fetch https://exemple.com' }, { quoted: m });
        try {
            const res = await axios.get(url, { timeout: 10000, maxRedirects: 5 });
            await sock.sendMessage(from, { text: `✅ ${url}\nStatut : ${res.status}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Le lien ne répond pas (${error.message})` }, { quoted: m });
        }
    },
};
