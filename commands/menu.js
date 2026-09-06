const fs = require('fs');
const path = require('path');
const CATEGORIES = require('../lib/menuCategories');
const { getSettings } = require('../lib/botSettings');
const { getConfig } = require('../lib/config');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.jpg');

module.exports = {
    name: 'menu',
    aliases: ['help'],
    description: 'Affiche le menu complet des commandes',
    async execute({ sock, m, from }) {
        const { commands } = require('../messageHandler');
        const s = getSettings();
        const prefix = getConfig().prefix || '.';
        const total = new Set([...commands.values()].map((c) => c.name)).size;

        let text = `╭━━━〔 👑 𝙆𝙄𝙉𝙂-𝗠𝗗 〕━━━╮\n`;
        text += `┃ 👑 Owner  : ${s.ownerName}\n`;
        text += `┃ ⚜️ Name   : ${s.botName}\n`;
        text += `┃ ⚜️ Commands: ${total}+\n`;
        text += `┃ ⚜️ Prefix  : ${prefix}\n`;
        text += `┃ ⚜️ Mode    : ${s.mode.toUpperCase()}\n`;
        text += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        text += `♛  THE ROYAL KINGDOM  ♛\n──「 COMMAND PALACE 」──\n\n`;

        for (const cat of CATEGORIES) {
            const found = cat.names.filter((n) => commands.has(n));
            if (!found.length) continue;
            text += `『 ${cat.title} 』\n╭────────────────────╮\n`;
            for (const name of found) text += `┃ ♜ ${prefix}${name}\n`;
            text += `╰────────────────────╯\n\n`;
        }

        text += `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
        text += `┃      👑 ${s.botName} 👑\n`;
        text += `┃    ♛ THE ROYAL KINGDOM ♛\n`;
        text += `┃ ⚜️ POWERED BY ${s.ownerName}\n`;
        text += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        if (fs.existsSync(LOGO_PATH)) {
            await sock.sendMessage(from, { image: fs.readFileSync(LOGO_PATH), caption: text }, { quoted: m });
        } else {
            await sock.sendMessage(from, { text }, { quoted: m });
        }
    },
};
