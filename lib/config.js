const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'data', 'config.json');

function getConfig() {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch {
        return { prefix: '.' };
    }
}

function setConfig(partial) {
    const current = getConfig();
    const next = { ...current, ...partial };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2));
    return next;
}

module.exports = { getConfig, setConfig };
