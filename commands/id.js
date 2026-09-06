module.exports = {
    name: 'id',
    description: "Affiche l'identifiant WhatsApp du chat actuel (et de la personne visée si réponse)",
    async execute({ sock, m, from }) {
        const target = m.message.extendedTextMessage?.contextInfo?.participant;
        const text = [`🆔 Chat : ${from}`, target ? `🆔 Personne visée : ${target}` : null].filter(Boolean).join('\n');
        await sock.sendMessage(from, { text }, { quoted: m });
    },
};
