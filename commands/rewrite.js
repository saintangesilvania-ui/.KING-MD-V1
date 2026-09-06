const { askAI } = require('../lib/aiClient');

module.exports = {
    name: 'rewrite',
    description: 'Reformule un texte : .rewrite <texte>',
    async execute({ sock, m, from, args }) {
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: '⚠️ Donne un texte à reformuler : .rewrite <texte>' }, { quoted: m });

        try {
            const rewritten = await askAI(text, 'Reformule ce texte en français, même sens, formulation différente.');
            await sock.sendMessage(from, { text: rewritten }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
