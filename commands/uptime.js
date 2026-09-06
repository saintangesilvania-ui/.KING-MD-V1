module.exports = {
    name: 'uptime',
    description: "Affiche depuis combien de temps le bot tourne",
    async execute({ sock, m, from }) {
        const s = process.uptime();
        const h = Math.floor(s / 3600), min = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
        await sock.sendMessage(from, { text: `⏱️ En ligne depuis : ${h}h ${min}min ${sec}s` }, { quoted: m });
    },
};
