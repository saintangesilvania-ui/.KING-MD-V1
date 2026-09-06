const { isOwner } = require('../lib/permissions');
const { isGroup, getGroupAdmins } = require('../lib/groupHelpers');
const { createPending, hasPending, clearPending } = require('../lib/pendingActions');

const DELAY_MS = 5000;

module.exports = {
    name: 'kickall',
    description: '⚠️ Retire TOUS les non-admins du groupe (réservé au propriétaire du bot)',
    async execute({ sock, m, from }) {
        if (!isGroup(from)) {
            return sock.sendMessage(from, { text: '⚠️ Cette commande ne marche que dans un groupe.' }, { quoted: m });
        }
        const senderJid = m.key.participant || from;
        if (!isOwner(senderJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé au propriétaire du bot (commande destructive).' }, { quoted: m });
        }

        const metadata = await sock.groupMetadata(from);
        const admins = await getGroupAdmins(sock, from);
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

        if (!admins.some((a) => a.startsWith(sock.user.id.split(':')[0]))) {
            return sock.sendMessage(from, { text: '⛔ Je dois être admin du groupe pour faire ça.' }, { quoted: m });
        }

        const toKick = metadata.participants
            .map((p) => p.id)
            .filter((id) => !admins.includes(id) && id !== botJid);

        if (toKick.length === 0) {
            return sock.sendMessage(from, { text: 'ℹ️ Personne à retirer (tout le monde est admin).' }, { quoted: m });
        }

        if (hasPending(from, senderJid)) {
            return sock.sendMessage(from, { text: '⚠️ Un .kickall est déjà en compte à rebours ici.' }, { quoted: m });
        }

        const entry = createPending(from, senderJid);
        await sock.sendMessage(
            from,
            {
                text: `☠️ *ROYAL PURGE INCOMING* ☠️\n\n${toKick.length} membre(s) vont être bannis du royaume dans 5 secondes...\n\n👉 Tape *stop* pour annuler avant qu'il ne soit trop tard.`,
            },
            { quoted: m }
        );

        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

        if (entry.cancelled) {
            return; // le message d'annulation a déjà été envoyé par le handler "stop"
        }
        clearPending(from, senderJid);

        await sock.sendMessage(from, { text: `⏳ Purge en cours...` });
        for (const jid of toKick) {
            try {
                await sock.groupParticipantsUpdate(from, [jid], 'remove');
            } catch (e) {
                console.error('Erreur kick sur', jid, e.message);
            }
        }
        await sock.sendMessage(from, { text: '✅ Le royaume a été purgé.' });
    },
};
