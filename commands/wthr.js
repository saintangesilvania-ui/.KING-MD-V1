const axios = require('axios');
module.exports = {
    name: 'wthr',
    aliases: ['weather', 'meteo'],
    description: 'Affiche la météo actuelle : .wthr Paris',
    async execute({ sock, m, from, args }) {
        const city = args.join(' ');
        if (!city) return sock.sendMessage(from, { text: '⚠️ Donne une ville : .wthr Paris' }, { quoted: m });
        try {
            const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}`, { params: { format: '3' } });
            await sock.sendMessage(from, { text: `🌤️ ${data}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: '❌ Ville introuvable.' }, { quoted: m });
        }
    },
};
