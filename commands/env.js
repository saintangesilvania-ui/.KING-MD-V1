const os = require('os');
const { isOwner } = require('../lib/permissions');

module.exports = {
    name: 'env',
    description: 'Affiche les infos système du bot (owner uniquement)',
    async execute({ sock, m, from }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé au propriétaire du bot.' }, { quoted: m });
        }
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const min = Math.floor((uptime % 3600) / 60);
        const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

        const info = [
            `🖥️ *Infos système*`,
            `Node.js : ${process.version}`,
            `Plateforme : ${os.platform()} (${os.arch()})`,
            `Mémoire utilisée : ${usedMem} MB`,
            `Uptime : ${h}h ${min}min`,
        ].join('\n');

        await sock.sendMessage(from, { text: info }, { quoted: m });
    },
};
