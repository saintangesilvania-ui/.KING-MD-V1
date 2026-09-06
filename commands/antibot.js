const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'antibot',
    description: 'Anti-bot (détection heuristique, limitée) : .antibot on / .antibot off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'antibot');
            return sock.sendMessage(from, { text: `ℹ️ Anti-bot (détection heuristique, limitée) actuellement : ${current ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setToggle(from, 'antibot', state === 'on');
        await sock.sendMessage(from, { text: `✅ Anti-bot (détection heuristique, limitée) ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
