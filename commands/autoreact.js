const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'autoreact',
    description: 'Réaction automatique à chaque message : .autoreact on / .autoreact off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'autoreact');
            return sock.sendMessage(from, { text: `ℹ️ Réaction automatique à chaque message actuellement : ${current ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setToggle(from, 'autoreact', state === 'on');
        await sock.sendMessage(from, { text: `✅ Réaction automatique à chaque message ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
