const axios = require('axios');

module.exports = {
    name: 'translate',
    aliases: ['tr'],
    description: 'Traduit un texte : .translate fr Hello world',
    async execute({ sock, m, from, args }) {
        const targetLang = args[0];
        const text = args.slice(1).join(' ');
        if (!targetLang || !text) {
            return sock.sendMessage(from, { text: '⚠️ Usage : .translate fr Hello world' }, { quoted: m });
        }
        try {
            const { data } = await axios.get('https://translate.googleapis.com/translate_a/single', {
                params: { client: 'gtx', sl: 'auto', tl: targetLang, dt: 't', q: text },
            });
            const translated = data[0].map((chunk) => chunk[0]).join('');
            await sock.sendMessage(from, { text: `🌐 ${translated}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: '❌ Échec de la traduction.' }, { quoted: m });
        }
    },
};
