const { askAI } = require('../lib/aiClient');

module.exports = {
    name: 'roast',
    description: "Clash amical quelqu'un (pour rire, entre amis) : réponds à son message ou .roast <nom>",
    async execute({ sock, m, from, args }) {
        const target = m.message.extendedTextMessage?.contextInfo?.participant;
        const label = target ? `@${target.split('@')[0]}` : (args.join(' ') || 'cette personne');
        try {
            const text = await askAI(`Fais un roast très léger et bienveillant, façon blague entre amis, sur : ${label}. Reste gentil, pas méchant.`, 'Tu fais de l\'humour taquin mais jamais blessant, en français.');
            await sock.sendMessage(from, { text, mentions: target ? [target] : [] }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
