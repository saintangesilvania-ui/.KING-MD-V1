const { askAI } = require('../lib/aiClient');

module.exports = {
    name: 'explain',
    description: 'Explique un sujet simplement : .explain la mécanique quantique',
    async execute({ sock, m, from, args }) {
        const topic = args.join(' ');
        if (!topic) return sock.sendMessage(from, { text: '⚠️ Donne un sujet : .explain <sujet>' }, { quoted: m });

        try {
            const explanation = await askAI(topic, 'Explique ce sujet simplement, comme à quelqu\'un qui découvre, en français.');
            await sock.sendMessage(from, { text: explanation }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
