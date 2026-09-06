const axios = require('axios');

module.exports = {
    name: 'fb',
    aliases: ['facebook'],
    description: 'Télécharge une vidéo Facebook (best-effort) : .fb <lien>',
    async execute({ sock, m, from, args }) {
        const url = args[0];
        if (!url || !url.includes('facebook.com') && !url.includes('fb.watch')) {
            return sock.sendMessage(from, { text: '⚠️ Lien Facebook invalide : .fb <lien>' }, { quoted: m });
        }
        try {
            const { data } = await axios.get('https://api.tiklydown.eu.org/api/download', { params: { url } });
            const videoUrl = data?.video?.url;
            if (!videoUrl) throw new Error('Vidéo introuvable.');
            await sock.sendMessage(from, { video: { url: videoUrl } }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Échec (Facebook bloque souvent ce type de requête) : ${error.message}` }, { quoted: m });
        }
    },
};
