const { checkGroupPermissions } = require('../lib/groupHelpers');
const { removeBan } = require('../lib/groupSettings');

module.exports = {
    name: 'unban',
    description: 'Débannit un numéro : .unban 50912345678',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const number = (args[0] || '').replace(/[^0-9]/g, '');
        if (!number) return sock.sendMessage(from, { text: '⚠️ Donne le numéro : .unban 50912345678' }, { quoted: m });

        removeBan(from, number);
        await sock.sendMessage(from, { text: `✅ ${number} débanni.` }, { quoted: m });
    },
};
