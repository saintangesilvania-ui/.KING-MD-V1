module.exports = {
    name: 'getpp',
    description: "Récupère la photo de profil d'un contact : .getpp 50912345678 ou réponds à son message",
    async execute({ sock, m, from, args }) {
        const target = m.message.extendedTextMessage?.contextInfo?.participant
            || (args[0] ? `${args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net` : m.key.participant || from);
        try {
            const url = await sock.profilePictureUrl(target, 'image');
            await sock.sendMessage(from, { image: { url } }, { quoted: m });
        } catch {
            await sock.sendMessage(from, { text: "❌ Photo de profil introuvable (privée ou aucune photo)." }, { quoted: m });
        }
    },
};
