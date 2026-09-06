module.exports = {
    name: 'poll',
    description: 'Crée un sondage : .poll Question ? | Option1 | Option2',
    async execute({ sock, m, from, args }) {
        const parts = args.join(' ').split('|').map((s) => s.trim()).filter(Boolean);
        if (parts.length < 3) return sock.sendMessage(from, { text: '⚠️ Format : .poll Question ? | Option1 | Option2' }, { quoted: m });
        const [name, ...options] = parts;
        await sock.sendMessage(from, { poll: { name, values: options, selectableCount: 1 } }, { quoted: m });
    },
};
