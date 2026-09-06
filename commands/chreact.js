module.exports = {
    name: 'chreact',
    description: 'Réagit au message du canal avec un emoji : réponds au message avec .chreact 🔥',
    async execute({ sock, m, from, args }) {
        const emoji = args[0] || '❤️';
        const contextInfo = m.message.extendedTextMessage?.contextInfo;
        if (!contextInfo?.stanzaId) return sock.sendMessage(from, { text: '⚠️ Réponds au message du canal.' }, { quoted: m });
        try {
            await sock.newsletterReactMessage(from, contextInfo.stanzaId, emoji);
            await sock.sendMessage(from, { text: '✅ Réaction envoyée.' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
