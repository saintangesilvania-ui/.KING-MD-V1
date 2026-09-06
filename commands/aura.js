module.exports = {
    name: 'aura',
    description: "Donne un score d'aura random et fun à quelqu'un",
    async execute({ sock, m, from }) {
        const target = m.message.extendedTextMessage?.contextInfo?.participant || m.key.participant;
        const score = Math.floor(Math.random() * 2000) - 1000;
        await sock.sendMessage(from, { text: `✨ Aura : ${score} points`, mentions: target ? [target] : [] }, { quoted: m });
    },
};
