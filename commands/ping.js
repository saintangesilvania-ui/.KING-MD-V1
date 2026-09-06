module.exports = {
    name: 'ping',
    description: 'Vérifie que le bot répond',
    async execute({ sock, m, from }) {
        const start = Date.now();
        await sock.sendMessage(from, { text: '🏓 Pong !' }, { quoted: m });
        const ms = Date.now() - start;
        await sock.sendMessage(from, { text: `⚡ Latence : ${ms}ms` });
    },
};
