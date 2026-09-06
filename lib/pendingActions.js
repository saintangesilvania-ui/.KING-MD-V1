// Actions en attente de confirmation (ex: .kickall) — annulables en tapant "stop"
const pending = new Map(); // clé: chatJid:senderJid -> { cancelled }

function createPending(chatJid, senderJid) {
    const key = `${chatJid}:${senderJid}`;
    const entry = { cancelled: false };
    pending.set(key, entry);
    return entry;
}

function cancelPending(chatJid, senderJid) {
    const key = `${chatJid}:${senderJid}`;
    const entry = pending.get(key);
    if (!entry) return false;
    entry.cancelled = true;
    pending.delete(key);
    return true;
}

function hasPending(chatJid, senderJid) {
    return pending.has(`${chatJid}:${senderJid}`);
}

function clearPending(chatJid, senderJid) {
    pending.delete(`${chatJid}:${senderJid}`);
}

module.exports = { createPending, cancelPending, hasPending, clearPending };
