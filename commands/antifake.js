const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'antifake',
    description: 'Anti faux-numéros : .antifake on / .antifake off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'antifake');
            return sock.sendMessage(from, { text: `ℹ️ Anti faux-numéros actuellement : ${current ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setToggle(from, 'antifake', state === 'on');
        await sock.sendMessage(from, { text: `✅ Anti faux-numéros ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
