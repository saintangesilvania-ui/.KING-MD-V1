const fs = require('fs');
const path = require('path');

const SETTINGS_PATH = path.join(__dirname, '..', 'data', 'botSettings.json');

const DEFAULTS = {
    mode: 'public',
    botName: 'KING-MD V1',
    ownerName: '𝗞𝗜𝗡𝗚 𝙎𝙏𝘼𝙍𝙆⁹⁹⁹',
    ownerNumber: '',
    description: 'Bot WhatsApp',
    stickerName: 'KING-MD',
    reactEmojis: ['👍', '🔥', '😂', '❤️', '👀'],
    ownerEmojis: ['👑'],
    online: false,
    statusLike: false,
    autoread: false,
    autotyping: false,
    recording: false,
    anticall: false,
    anticallMessage: "⛔ Les appels ne sont pas acceptés ici.",
    statusview: false,
    adminaction: false,
};

function getSettings() {
    try {
        return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8')) };
    } catch {
        return { ...DEFAULTS };
    }
}

function setSettings(partial) {
    const current = getSettings();
    const next = { ...current, ...partial };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2));
    return next;
}

module.exports = { getSettings, setSettings };
