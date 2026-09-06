const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'mute',
    description: 'Seuls les admins peuvent écrire dans le groupe',
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        await sock.groupSettingUpdate(from, 'announcement');
        await sock.sendMessage(from, { text: '🔇 Groupe mis en mode "admins seulement".' }, { quoted: m });
    },
};
