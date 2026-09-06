const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'anticallmsg',
    description: "Change le message envoyé à ceux qui appellent : .anticallmsg <texte>",
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: `ℹ️ Actuel : ${getSettings().anticallMessage}` }, { quoted: m });
        setSettings({ anticallMessage: text });
        await sock.sendMessage(from, { text: '✅ Message mis à jour.' }, { quoted: m });
    },
};
