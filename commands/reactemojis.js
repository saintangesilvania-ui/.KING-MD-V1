const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'reactemojis',
    description: "Change la liste d'emojis pour .autoreact : .reactemojis 👍 🔥 😂",
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        if (!args.length) return sock.sendMessage(from, { text: `ℹ️ Actuel : ${getSettings().reactEmojis.join(' ')}` }, { quoted: m });
        setSettings({ reactEmojis: args });
        await sock.sendMessage(from, { text: '✅ Emojis mis à jour.' }, { quoted: m });
    },
};
