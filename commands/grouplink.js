const { isGroup } = require('../lib/groupHelpers');

module.exports = {
    name: 'grouplink',
    description: "Affiche le lien d'invitation du groupe",
    async execute({ sock, m, from }) {
        if (!isGroup(from)) return sock.sendMessage(from, { text: '⚠️ Marche seulement dans un groupe.' }, { quoted: m });
        try {
            const code = await sock.groupInviteCode(from);
            await sock.sendMessage(from, { text: `🔗 https://chat.whatsapp.com/${code}` }, { quoted: m });
        } catch {
            await sock.sendMessage(from, { text: "❌ Je dois être admin pour récupérer le lien." }, { quoted: m });
        }
    },
};
