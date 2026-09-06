function isGroup(from) {
    return from.endsWith('@g.us');
}

async function getGroupAdmins(sock, groupJid) {
    const metadata = await sock.groupMetadata(groupJid);
    return metadata.participants
        .filter((p) => p.admin === 'admin' || p.admin === 'superadmin')
        .map((p) => p.id);
}

async function checkGroupPermissions(sock, m, from) {
    if (!isGroup(from)) {
        return { ok: false, reason: '⚠️ Cette commande ne marche que dans un groupe.' };
    }
    const admins = await getGroupAdmins(sock, from);
    const sender = m.key.participant;
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!admins.includes(sender)) {
        return { ok: false, reason: '⛔ Réservé aux admins du groupe.' };
    }
    if (!admins.some((a) => a.startsWith(sock.user.id.split(':')[0]))) {
        return { ok: false, reason: "⛔ Je dois être admin du groupe pour faire ça." };
    }
    return { ok: true };
}

// Récupère le JID de la personne visée : mention (@untel) ou message cité
function extractTarget(m) {
    const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentioned?.length) return mentioned[0];
    const quoted = m.message.extendedTextMessage?.contextInfo?.participant;
    if (quoted) return quoted;
    return null;
}

module.exports = { isGroup, getGroupAdmins, checkGroupPermissions, extractTarget };
