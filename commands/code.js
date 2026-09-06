const { askAI } = require('../lib/aiClient');

module.exports = {
    name: 'code',
    description: 'Génère ou explique du code : .code fonction JS qui trie un tableau',
    async execute({ sock, m, from, args }) {
        const request = args.join(' ');
        if (!request) return sock.sendMessage(from, { text: '⚠️ Décris ce que tu veux : .code <demande>' }, { quoted: m });

        try {
            const result = await askAI(request, 'Tu es un assistant de programmation. Réponds avec du code clair et commenté, et une brève explication en français.');
            await sock.sendMessage(from, { text: result }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
