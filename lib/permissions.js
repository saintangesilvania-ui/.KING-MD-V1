const fs = require('fs');
const path = require('path');

const ADMIN_PATH = path.join(__dirname, '..', 'data', 'admin.json');
const PREMIUM_PATH = path.join(__dirname, '..', 'data', 'premium.json');

// Mets ton propre numéro ici (indicatif pays, sans + ni espace)
const OWNER_NUMBERS = (process.env.OWNER_NUMBER || '').split(',').filter(Boolean);

function readList(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return [];
    }
}

function writeList(filePath, list) {
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
}

function numberFromJid(jid) {
    return jid.replace(/[^0-9]/g, '');
}

function isOwner(jid) {
    return OWNER_NUMBERS.includes(numberFromJid(jid));
}

function isAdmin(jid) {
    if (isOwner(jid)) return true;
    return readList(ADMIN_PATH).includes(numberFromJid(jid));
}

function isPremium(jid) {
    if (isOwner(jid) || isAdmin(jid)) return true;
    return readList(PREMIUM_PATH).includes(numberFromJid(jid));
}

function addToList(filePath, jid) {
    const number = numberFromJid(jid);
    const list = readList(filePath);
    if (!list.includes(number)) {
        list.push(number);
        writeList(filePath, list);
        return true;
    }
    return false;
}

function removeFromList(filePath, jid) {
    const number = numberFromJid(jid);
    const list = readList(filePath);
    const next = list.filter((n) => n !== number);
    const changed = next.length !== list.length;
    if (changed) writeList(filePath, next);
    return changed;
}

module.exports = {
    isOwner,
    isAdmin,
    isPremium,
    addAdmin: (jid) => addToList(ADMIN_PATH, jid),
    removeAdmin: (jid) => removeFromList(ADMIN_PATH, jid),
    addPremium: (jid) => addToList(PREMIUM_PATH, jid),
    removePremium: (jid) => removeFromList(PREMIUM_PATH, jid),
};
