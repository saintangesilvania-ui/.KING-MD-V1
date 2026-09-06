const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'antitag',
    description: 'Bloque le tag-all des non-admins : .antitag on / .antitag off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'antitag');
            return sock.sendMessage(from, { text: `ℹ️ Bloque le tag-all des non-admins actuellement : ${current ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setToggle(from, 'antitag', state === 'on');
        await sock.sendMessage(from, { text: `✅ Bloque le tag-all des non-admins ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
