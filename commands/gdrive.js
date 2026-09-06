module.exports = {
    name: 'gdrive',
    description: "Renvoie le lien de téléchargement direct d'un fichier Google Drive public : .gdrive <lien>",
    async execute({ sock, m, from, args }) {
        const url = args[0];
        const match = url?.match(/[-\w]{25,}/);
        if (!match) return sock.sendMessage(from, { text: '⚠️ Lien Google Drive invalide.' }, { quoted: m });
        const direct = `https://drive.google.com/uc?export=download&id=${match[0]}`;
        await sock.sendMessage(from, { text: `🔗 Lien direct (le fichier doit être public) :\n${direct}` }, { quoted: m });
    },
};
