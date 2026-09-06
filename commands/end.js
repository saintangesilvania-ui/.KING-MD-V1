const { isOwner } = require('../lib/permissions');
const { isGroup } = require('../lib/groupHelpers');

module.exports = {
    name: 'end',
    description: 'Supprime définitivement le groupe (owner uniquement, irréversible)',
    async execute({ sock, m, from }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        if (!isGroup(from)) return sock.sendMessage(from, { text: '⚠️ Marche seulement dans un groupe.' }, { quoted: m });
        const meta = await sock.groupMetadata(from);
        const allJids = meta.participants.map((p) => p.id).filter((id) => id !== sock.user.id.split(':')[0] + '@s.whatsapp.net');
        await sock.sendMessage(from, { text: '⚠️ Groupe en cours de fermeture...' });
        try { await sock.groupParticipantsUpdate(from, allJids, 'remove'); } catch {}
        await sock.groupLeave(from);
    },
};
