const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'ownername',
    description: 'Change le nom du propriétaire affiché : .ownername <valeur>',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const value = args.join(' ');
        if (!value) {
            return sock.sendMessage(from, { text: `ℹ️ Valeur actuelle : ${getSettings().ownerName || '(vide)'}` }, { quoted: m });
        }
        setSettings({ ownerName: value });
        await sock.sendMessage(from, { text: '✅ Mis à jour.' }, { quoted: m });
    },
};
