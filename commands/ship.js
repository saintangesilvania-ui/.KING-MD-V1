module.exports = {
    name: 'ship',
    description: 'Calcule un pourcentage de compatibilité random et fun entre deux personnes',
    async execute({ sock, m, from, args }) {
        const names = args.join(' ') || '💕';
        const percent = Math.floor(Math.random() * 101);
        await sock.sendMessage(from, { text: `💘 ${names} → ${percent}% compatible !` }, { quoted: m });
    },
};
