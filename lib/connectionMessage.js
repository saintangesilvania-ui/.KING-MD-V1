const fs = require('fs');
const path = require('path');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.jpg');

async function sendConnectionConfirmation(sock) {
    const ownerJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const text = [
        '👑 𝙆𝙄𝙉𝙂-𝗠𝗗 ⚡',
        '━━━━━━━━━━━━━━━━━━━━',
        '',
        '╭━━━〔 👑 𝗞𝗜𝗡𝗚 𝗦𝗬𝗦𝗧𝗘𝗠 〕━━━╮',
        '┃',
        '┃  🟢 CONNEXION ÉTABLIE',
        '┃  ⚡ Système opérationnel',
        '┃  🤖 KING-MD est maintenant en ligne',
        '┃',
        '╰━━━━━━━━━━━━━━━━━━━━╯',
        '',
        '«🛡️ Bienvenue, la puissance du KING est activée.»',
        '',
        '🎯 Commande principale',
        '╰➤ Tape .menu pour accéder au royaume des commandes.',
        '',
        '━━━━━━━━━━━━━━━━━━━━',
        '👑 𝗞𝗜𝗡𝗚 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥 — 𝗜𝗔',
        '╰➤ https://king-generator-ai.lovable.app',
        '',
        '📢 𝗖𝗛𝗔𝗜̂𝗡𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗢𝗙𝗙𝗜𝗖𝗜𝗘𝗟𝗟𝗘',
        '╰➤ https://whatsapp.com/channel/0029VbCY0ob7YSd0Oc9d650O',
        '',
        '━━━━━━━━━━━━━━━━━━━━',
        '⚡ 𝙆𝙄𝙉𝙂-𝗠𝗗 • 𝗣𝗢𝗪𝗘𝗥 𝗜𝗡 𝗬𝗢𝗨𝗥 𝗛𝗔𝗡𝗗𝗦 👑',
    ].join('\n');

    try {
        if (fs.existsSync(LOGO_PATH)) {
            await sock.sendMessage(ownerJid, { image: fs.readFileSync(LOGO_PATH), caption: text });
        } else {
            await sock.sendMessage(ownerJid, { text });
        }
    } catch (e) {
        console.error('Erreur message de confirmation:', e.message);
    }
}

module.exports = { sendConnectionConfirmation };
