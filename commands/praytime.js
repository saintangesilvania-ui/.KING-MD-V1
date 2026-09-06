const axios = require('axios');
module.exports = {
    name: 'praytime',
    description: 'Affiche les heures de prière : .praytime Paris',
    async execute({ sock, m, from, args }) {
        const city = args.join(' ');
        if (!city) return sock.sendMessage(from, { text: '⚠️ Donne une ville : .praytime Paris' }, { quoted: m });
        try {
            const { data } = await axios.get('https://api.aladhan.com/v1/timingsByCity', { params: { city, country: '', method: 2 } });
            const t = data?.data?.timings;
            if (!t) throw new Error('Ville introuvable');
            const text = `🕌 *${city}*\nFajr: ${t.Fajr}\nDhuhr: ${t.Dhuhr}\nAsr: ${t.Asr}\nMaghrib: ${t.Maghrib}\nIsha: ${t.Isha}`;
            await sock.sendMessage(from, { text }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
