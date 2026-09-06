const CITATIONS = [
    "Le succès, c'est tomber sept fois et se relever huit.",
    "La vie, c'est ce qui arrive pendant que tu fais d'autres projets.",
    "N'attends pas le moment parfait, prends le moment et rends-le parfait.",
    "Le doute tue plus de rêves que l'échec ne le fera jamais.",
];
module.exports = {
    name: 'quote',
    description: 'Envoie une citation inspirante aléatoire',
    async execute({ sock, m, from }) {
        const c = CITATIONS[Math.floor(Math.random() * CITATIONS.length)];
        await sock.sendMessage(from, { text: `💭 "${c}"` }, { quoted: m });
    },
};
