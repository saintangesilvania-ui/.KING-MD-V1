const { getConfig } = require('../lib/config');

module.exports = {
    name: 'links',
    aliases: ['liens', 'canal', 'channel'],
    description: 'Affiche les liens du canal et du groupe officiels',
    async execute({ sock, m, from }) {
        const cfg = getConfig();
        const text = [
            '🔗 *Nos liens*',
            cfg.channelLink ? `📢 Canal : ${cfg.channelLink}` : null,
            cfg.groupInviteLink ? `👥 Groupe : ${cfg.groupInviteLink}` : null,
        ].filter(Boolean).join('\n');
        await sock.sendMessage(from, { text: text || 'Aucun lien configuré.' }, { quoted: m });
    },
};
