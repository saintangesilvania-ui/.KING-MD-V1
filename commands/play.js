const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: 'play',
    description: 'Cherche et envoie l\'audio d\'une chanson YouTube : .play <titre>',
    async execute({ sock, m, from, args }) {
        const query = args.join(' ');
        if (!query) return sock.sendMessage(from, { text: '⚠️ Donne un titre : .play <titre>' }, { quoted: m });
        try {
            const { videos } = await ytSearch(query);
            if (!videos?.length) return sock.sendMessage(from, { text: '❌ Rien trouvé.' }, { quoted: m });
            const video = videos[0];
            await sock.sendMessage(from, { text: `🎵 ${video.title} (${video.timestamp})` }, { quoted: m });
            const stream = ytdl(video.url, { quality: 'highestaudio', filter: 'audioonly' });
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            await sock.sendMessage(from, { audio: Buffer.concat(chunks), mimetype: 'audio/mp4' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
