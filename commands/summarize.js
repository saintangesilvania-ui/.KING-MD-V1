const { askAI } = require('../lib/aiClient');

module.exports = {
    name: 'summarize',
    description: 'Résume un texte : réponds à un message avec .summarize, ou .summarize <texte>',
    async execute({ sock, m, from, args }) {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const text = quoted?.conversation || quoted?.extendedTextMessage?.text || args.join(' ');
        if (!text) return sock.sendMessage(from, { text: '⚠️ Réponds à un message ou donne un texte à résumer.' }, { quoted: m });

        try {
            const summary = await askAI(text, 'Résume ce texte en 2-3 phrases claires, en français.');
            await sock.sendMessage(from, { text: `📝 ${summary}` }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
