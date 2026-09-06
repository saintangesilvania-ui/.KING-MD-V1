const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: 'yt',
    aliases: ['youtube'],
    description: 'Télécharge une vidéo YouTube (max ~10 min) : .yt <lien>',
    async execute({ sock, m, from, args }) {
        const url = args[0];
        if (!url || !ytdl.validateURL(url)) {
            return sock.sendMessage(from, { text: '⚠️ Donne un lien YouTube valide : .yt https://youtube.com/watch?v=xxxx' }, { quoted: m });
        }

        try {
            const info = await ytdl.getInfo(url);
            const durationSec = parseInt(info.videoDetails.lengthSeconds, 10);
            if (durationSec > 600) {
                return sock.sendMessage(from, { text: '⚠️ Vidéo trop longue (max 10 minutes).' }, { quoted: m });
            }

            await sock.sendMessage(from, { text: `⏳ Téléchargement : ${info.videoDetails.title}` }, { quoted: m });

            const stream = ytdl(url, { quality: 'lowest', filter: 'audioandvideo' });
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const buffer = Buffer.concat(chunks);

            await sock.sendMessage(from, { video: buffer, caption: info.videoDetails.title }, { quoted: m });
        } catch (error) {
            console.error('Erreur yt:', error.message);
            await sock.sendMessage(from, { text: `❌ Échec du téléchargement : ${error.message}` }, { quoted: m });
        }
    },
};
