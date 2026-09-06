const { isOwner } = require('../lib/permissions');
const { setConfig } = require('../lib/config');

module.exports = {
    name: 'setprefix',
    description: 'Change le préfixe des commandes (owner uniquement) : .setprefix !',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) {
            return sock.sendMessage(from, { text: '⛔ Réservé au propriétaire du bot.' }, { quoted: m });
        }
        const newPrefix = args[0];
        if (!newPrefix || newPrefix.length > 3) {
            return sock.sendMessage(from, { text: '⚠️ Donne un préfixe court : .setprefix !' }, { quoted: m });
        }
        setConfig({ prefix: newPrefix });
        await sock.sendMessage(from, { text: `✅ Préfixe changé pour : ${newPrefix}` }, { quoted: m });
    },
};
