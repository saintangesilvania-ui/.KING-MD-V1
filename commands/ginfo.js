const { isGroup } = require('../lib/groupHelpers');

module.exports = {
    name: 'ginfo',
    aliases: ['groupstatus'],
    description: 'Affiche les infos du groupe',
    async execute({ sock, m, from }) {
        if (!isGroup(from)) return sock.sendMessage(from, { text: '⚠️ Marche seulement dans un groupe.' }, { quoted: m });
        const meta = await sock.groupMetadata(from);
        const text = [
            `📋 *${meta.subject}*`,
            meta.desc ? `📝 ${meta.desc}` : null,
            `👥 ${meta.participants.length} membres`,
            `🆔 ${meta.id}`,
        ].filter(Boolean).join('\n');
        await sock.sendMessage(from, { text }, { quoted: m });
    },
};
