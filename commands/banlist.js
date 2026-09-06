const { isGroup } = require('../lib/groupHelpers');
const { getGroup } = require('../lib/groupSettings');

module.exports = {
    name: 'banlist',
    description: 'Liste les numéros bannis du groupe',
    async execute({ sock, m, from }) {
        if (!isGroup(from)) return sock.sendMessage(from, { text: '⚠️ Marche seulement dans un groupe.' }, { quoted: m });
        const banned = getGroup(from).banned || [];
        if (!banned.length) return sock.sendMessage(from, { text: 'ℹ️ Aucun numéro banni.' }, { quoted: m });
        await sock.sendMessage(from, { text: `🔨 Bannis :\n${banned.map((n) => `▸ ${n}`).join('\n')}` }, { quoted: m });
    },
};
