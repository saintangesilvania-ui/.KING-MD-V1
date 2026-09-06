module.exports = {
    name: 'alive',
    description: 'Confirme que le bot est en ligne',
    async execute({ sock, m, from }) {
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const min = Math.floor((uptime % 3600) / 60);
        await sock.sendMessage(
            from,
            { text: `✅ Je suis en ligne !\n⏱️ Uptime : ${h}h ${min}min` },
            { quoted: m }
        );
    },
};
