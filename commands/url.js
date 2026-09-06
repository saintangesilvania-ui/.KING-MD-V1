const axios = require('axios');

module.exports = {
    name: 'url',
    aliases: ['shorten'],
    description: 'Raccourcit un lien : .url https://exemple.com/un-tres-long-lien',
    async execute({ sock, m, from, args }) {
        const link = args[0];
        if (!link || !link.startsWith('http')) {
            return sock.sendMessage(from, { text: '⚠️ Donne un lien valide : .url https://exemple.com' }, { quoted: m });
        }
        try {
            const { data } = await axios.get('https://tinyurl.com/api-create.php', { params: { url: link } });
            await sock.sendMessage(from, { text: `🔗 ${data}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: '❌ Échec du raccourcissement du lien.' }, { quoted: m });
        }
    },
};
