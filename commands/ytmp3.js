const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: 'ytmp3',
    description: 'Télécharge l\'audio d\'une vidéo YouTube : .ytmp3 <lien>',
    async execute({ sock, m, from, args }) {
        const url = args[0];
        if (!url || !ytdl.validateURL(url)) return sock.sendMessage(from, { text: '⚠️ Lien YouTube invalide : .ytmp3 <lien>' }, { quoted: m });
        try {
            const info = await ytdl.getInfo(url);
            await sock.sendMessage(from, { text: `⏳ Téléchargement audio : ${info.videoDetails.title}` }, { quoted: m });
            const stream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            await sock.sendMessage(from, { audio: Buffer.concat(chunks), mimetype: 'audio/mp4' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
