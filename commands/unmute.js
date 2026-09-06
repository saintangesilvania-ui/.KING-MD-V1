const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'unmute',
    description: 'Tout le monde peut écrire à nouveau dans le groupe',
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        await sock.groupSettingUpdate(from, 'not_announcement');
        await sock.sendMessage(from, { text: '🔊 Groupe rouvert à tout le monde.' }, { quoted: m });
    },
};
