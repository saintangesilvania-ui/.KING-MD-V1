const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'antilink',
    description: 'Suppression auto des liens (non-admins) : .antilink on / .antilink off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'antilink');
            return sock.sendMessage(from, { text: `ℹ️ Suppression auto des liens (non-admins) actuellement : ${current ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setToggle(from, 'antilink', state === 'on');
        await sock.sendMessage(from, { text: `✅ Suppression auto des liens (non-admins) ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
