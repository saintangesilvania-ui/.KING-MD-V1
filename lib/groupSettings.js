const fs = require('fs');
const path = require('path');

const SETTINGS_PATH = path.join(__dirname, '..', 'data', 'groupSettings.json');

function readAll() {
    try {
        return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    } catch {
        return {};
    }
}

function writeAll(data) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2));
}

function getGroup(groupJid) {
    const all = readAll();
    return all[groupJid] || { warnings: {}, banned: [], toggles: {} };
}

function updateGroup(groupJid, partial) {
    const all = readAll();
    const current = all[groupJid] || { warnings: {}, banned: [], toggles: {} };
    all[groupJid] = { ...current, ...partial };
    writeAll(all);
    return all[groupJid];
}

function setToggle(groupJid, key, value) {
    const g = getGroup(groupJid);
    g.toggles[key] = value;
    updateGroup(groupJid, g);
    return value;
}

function isToggled(groupJid, key) {
    return !!getGroup(groupJid).toggles?.[key];
}

function addWarning(groupJid, number) {
    const g = getGroup(groupJid);
    g.warnings[number] = (g.warnings[number] || 0) + 1;
    updateGroup(groupJid, g);
    return g.warnings[number];
}

function removeWarning(groupJid, number) {
    const g = getGroup(groupJid);
    g.warnings[number] = Math.max(0, (g.warnings[number] || 0) - 1);
    updateGroup(groupJid, g);
    return g.warnings[number];
}

function resetWarnings(groupJid, number) {
    const g = getGroup(groupJid);
    g.warnings[number] = 0;
    updateGroup(groupJid, g);
}

function getWarnings(groupJid, number) {
    return getGroup(groupJid).warnings?.[number] || 0;
}

function isBanned(groupJid, number) {
    return getGroup(groupJid).banned?.includes(number);
}

function addBan(groupJid, number) {
    const g = getGroup(groupJid);
    if (!g.banned.includes(number)) g.banned.push(number);
    updateGroup(groupJid, g);
}

function removeBan(groupJid, number) {
    const g = getGroup(groupJid);
    g.banned = g.banned.filter((n) => n !== number);
    updateGroup(groupJid, g);
}

module.exports = {
    getGroup, updateGroup, setToggle, isToggled,
    addWarning, removeWarning, resetWarnings, getWarnings,
    isBanned, addBan, removeBan,
};
