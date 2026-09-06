const path = require('path');
const { isOwner } = require('../lib/permissions');
const { encodeSession } = require('../lib/sessionString');

module.exports = {
    name: 'getsession',
    description: "Génère la SESSION_ID à sauvegarder dans Render (Environment) pour survivre aux redémarrages",
    async execute({ sock, m, from }) {
        const senderJid = m.key.participant || from;
        if (!isOwner(senderJid)) {
            return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        }

        const number = sock.user.id.split(':')[0];
        const sessionPath = path.join(__dirname, '..', 'session', number);
        const sessionId = encodeSession(sessionPath);

        if (!sessionId) {
            return sock.sendMessage(from, { text: '❌ Aucune session trouvée pour ce numéro.' }, { quoted: m });
        }

        const ownerJid = senderJid; // toujours envoyé en privé au owner, jamais dans le groupe
        await sock.sendMessage(ownerJid, {
            text: `🔑 *SESSION_ID* (à copier tel quel)\n\nSur Render → Settings → Environment, ajoute ces DEUX variables :\n\nSESSION_ID=${sessionId}\n\nSESSION_NUMBER=${number}\n\n⚠️ Ne partage JAMAIS cette chaîne — elle donne un accès complet à ce compte WhatsApp.`,
        });

        if (from !== ownerJid) {
            await sock.sendMessage(from, { text: '✅ Envoyé en message privé.' }, { quoted: m });
        }
    },
};
