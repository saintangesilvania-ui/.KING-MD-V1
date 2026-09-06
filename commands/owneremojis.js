const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'owneremojis',
    description: "Change les emojis utilisés pour marquer les messages du owner : .owneremojis 👑",
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        if (!args.length) return sock.sendMessage(from, { text: `ℹ️ Actuel : ${getSettings().ownerEmojis.join(' ')}` }, { quoted: m });
        setSettings({ ownerEmojis: args });
        await sock.sendMessage(from, { text: '✅ Emojis mis à jour.' }, { quoted: m });
    },
};
