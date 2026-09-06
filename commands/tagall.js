const { isGroup, getGroupAdmins } = require('../lib/groupHelpers');

module.exports = {
    name: 'tagall',
    description: 'Mentionne tous les membres du groupe (admins uniquement) : .tagall Réunion ce soir !',
    async execute({ sock, m, from, args }) {
        if (!isGroup(from)) {
            return sock.sendMessage(from, { text: '⚠️ Cette commande ne marche que dans un groupe.' }, { quoted: m });
        }

        const admins = await getGroupAdmins(sock, from);
        const sender = m.key.participant;
        if (!admins.includes(sender)) {
            return sock.sendMessage(from, { text: '⛔ Réservé aux admins du groupe.' }, { quoted: m });
        }

        const metadata = await sock.groupMetadata(from);
        const participants = metadata.participants.map((p) => p.id);
        const customText = args.join(' ');

        const mentionLines = participants.map((jid) => `@${jid.split('@')[0]}`).join('\n');
        const text = customText ? `📢 ${customText}\n\n${mentionLines}` : `📢 *Tag All*\n\n${mentionLines}`;

        await sock.sendMessage(from, { text, mentions: participants });
    },
};
