const REPONSES = [
    "Oui, certainement.", "Non, pas du tout.", "Demande à nouveau plus tard.",
    "C'est probable.", "Difficile à dire.", "Sans aucun doute.", "Je ne compterais pas dessus.",
];
module.exports = {
    name: '8ball',
    description: 'Pose une question, la boule magique répond : .8ball <question>',
    async execute({ sock, m, from, args }) {
        if (!args.length) return sock.sendMessage(from, { text: '⚠️ Pose une question : .8ball <question>' }, { quoted: m });
        const reponse = REPONSES[Math.floor(Math.random() * REPONSES.length)];
        await sock.sendMessage(from, { text: `🎱 ${reponse}` }, { quoted: m });
    },
};
