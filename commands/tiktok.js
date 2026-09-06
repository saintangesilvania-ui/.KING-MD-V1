const axios = require('axios');

module.exports = {
    name: 'tiktok',
    aliases: ['tt'],
    description: 'Télécharge une vidéo TikTok sans watermark : .tiktok <lien>',
    async execute({ sock, m, from, args }) {
        const url = args[0];
        if (!url || !url.includes('tiktok.com')) {
            return sock.sendMessage(from, { text: '⚠️ Donne un lien TikTok valide : .tiktok https://vm.tiktok.com/xxxx' }, { quoted: m });
        }

        await sock.sendMessage(from, { text: '⏳ Téléchargement en cours...' }, { quoted: m });

        try {
            const { data } = await axios.get('https://www.tikwm.com/api/', { params: { url } });
            const videoUrl = data?.data?.play;
            if (!videoUrl) throw new Error('Vidéo introuvable (lien invalide ou vidéo privée)');

            await sock.sendMessage(
                from,
                { video: { url: videoUrl }, caption: `🎵 ${data.data.title || ''}` },
                { quoted: m }
            );
        } catch (error) {
            console.error('Erreur tiktok:', error.message);
            await sock.sendMessage(from, { text: `❌ Échec du téléchargement : ${error.message}` }, { quoted: m });
        }
    },
};
