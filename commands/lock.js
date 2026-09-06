const { checkGroupPermissions } = require('../lib/groupHelpers');

module.exports = {
    name: 'lock',
    description: 'Seuls les admins peuvent modifier les infos du groupe (nom, photo, description)',
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        await sock.groupSettingUpdate(from, 'locked');
        await sock.sendMessage(from, { text: '🔒 Groupe verrouillé (infos modifiables par les admins seulement).' }, { quoted: m });
    },
};
