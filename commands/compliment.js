const COMPLIMENTS = [
    "Tu illumines chaque pièce où tu entres.",
    "Ton énergie est contagieuse.",
    "T'as un sens de l'humour incroyable.",
    "Les gens ont de la chance de te connaître.",
    "Tu gères mieux que tu ne le penses.",
];
module.exports = {
    name: 'compliment',
    description: 'Envoie un compliment aléatoire',
    async execute({ sock, m, from }) {
        const target = m.message.extendedTextMessage?.contextInfo?.participant;
        const c = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
        await sock.sendMessage(from, { text: `💖 ${target ? '@' + target.split('@')[0] + ' ' : ''}${c}`, mentions: target ? [target] : [] }, { quoted: m });
    },
};
