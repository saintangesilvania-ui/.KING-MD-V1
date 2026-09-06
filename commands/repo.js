const { getConfig } = require('../lib/config');

module.exports = {
    name: 'repo',
    aliases: ['repository', 'site'],
    description: 'Affiche le lien du bot KING-MD et de King Generator',
    async execute({ sock, m, from }) {
        const cfg = getConfig();
        const text = [
            '👑 *KING-MD*',
            '',
            cfg.botUrl ? `🔗 Site du bot : ${cfg.botUrl}` : null,
            '🎨 King Generator (IA) : https://neon-king-forge.lovable.app/',
        ].filter(Boolean).join('\n');
        await sock.sendMessage(from, { text }, { quoted: m });
    },
};
