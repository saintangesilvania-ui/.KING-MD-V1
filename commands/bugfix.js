const { askAI } = require('../lib/aiClient');

module.exports = {
    name: 'bugfix',
    description: 'Corrige un bug de code : réponds à un message de code avec .bugfix <description du problème>',
    async execute({ sock, m, from, args }) {
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const code = quoted?.conversation || quoted?.extendedTextMessage?.text;
        const description = args.join(' ');
        if (!code) return sock.sendMessage(from, { text: '⚠️ Réponds au message contenant le code, avec une description du bug.' }, { quoted: m });

        try {
            const prompt = `Code :\n${code}\n\nProblème décrit : ${description || '(non précisé)'}`;
            const fix = await askAI(prompt, 'Tu es un débogueur expert. Identifie le bug et propose le code corrigé, en français.');
            await sock.sendMessage(from, { text: fix }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
