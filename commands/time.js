module.exports = {
    name: 'time',
    description: "Affiche l'heure et la date actuelles",
    async execute({ sock, m, from }) {
        const now = new Date();
        await sock.sendMessage(from, { text: `🕐 ${now.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}` }, { quoted: m });
    },
};
