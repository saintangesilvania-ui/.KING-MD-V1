const { askAI } = require('../lib/aiClient');

module.exports = {
    name: 'ai',
    aliases: ['gpt', 'chatbot'],
    description: "Pose une question à l'IA : .ai explique-moi la relativité",
    async execute({ sock, m, from, args }) {
        const question = args.join(' ');
        if (!question) return sock.sendMessage(from, { text: '⚠️ Écris ta question : .ai <question>' }, { quoted: m });

        try {
            const answer = await askAI(question);
            await sock.sendMessage(from, { text: answer }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
