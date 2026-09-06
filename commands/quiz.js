const QUESTIONS = [
    { q: 'Quelle est la capitale du Japon ?', a: 'Tokyo' },
    { q: "Combien de continents y a-t-il sur Terre ?", a: '7' },
    { q: 'Quel est le plus grand océan du monde ?', a: 'Pacifique' },
    { q: "Qui a peint la Joconde ?", a: 'Léonard de Vinci' },
    { q: 'Combien de côtés a un hexagone ?', a: '6' },
    { q: "Quelle planète est surnommée la planète rouge ?", a: 'Mars' },
];

module.exports = {
    name: 'quiz',
    description: 'Pose une question de culture générale (réponse révélée après 15 secondes)',
    async execute({ sock, m, from }) {
        const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        await sock.sendMessage(from, { text: `🧠 *Quiz* : ${question.q}\n\n(Réponse dans 15 secondes...)` }, { quoted: m });

        setTimeout(() => {
            sock.sendMessage(from, { text: `✅ Réponse : *${question.a}*` }).catch(() => {});
        }, 15000);
    },
};
