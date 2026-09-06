const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'stickername',
    description: 'Change le nom apposé sur les stickers créés : .stickername <valeur>',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const value = args.join(' ');
        if (!value) {
            return sock.sendMessage(from, { text: `ℹ️ Valeur actuelle : ${getSettings().stickerName || '(vide)'}` }, { quoted: m });
        }
        setSettings({ stickerName: value });
        await sock.sendMessage(from, { text: '✅ Mis à jour.' }, { quoted: m });
    },
};
