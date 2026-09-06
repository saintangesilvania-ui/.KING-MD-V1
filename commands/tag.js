module.exports = {
    name: 'tag',
    description: 'Répond à un message en mentionnant son auteur : réponds à un message avec .tag <texte>',
    async execute({ sock, m, from, args }) {
        const target = m.message.extendedTextMessage?.contextInfo?.participant;
        if (!target) return sock.sendMessage(from, { text: '⚠️ Réponds à un message avec .tag' }, { quoted: m });
        const text = args.join(' ') || `@${target.split('@')[0]}`;
        await sock.sendMessage(from, { text, mentions: [target] }, { quoted: m });
    },
};
