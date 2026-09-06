const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'unlock',
    description: 'Tout le monde peut modifier les infos du groupe à nouveau',
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        await sock.groupSettingUpdate(from, 'unlocked');
        await sock.sendMessage(from, { text: '🔓 Groupe déverrouillé.' }, { quoted: m });
    },
};
