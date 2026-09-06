module.exports = {
    name: 'emoji',
    description: 'Envoie un emoji géant : .emoji 🔥',
    async execute({ sock, m, from, args }) {
        const emoji = args[0];
        if (!emoji) return sock.sendMessage(from, { text: '⚠️ Donne un emoji : .emoji 🔥' }, { quoted: m });
        await sock.sendMessage(from, { text: emoji }, { quoted: m });
    },
};
