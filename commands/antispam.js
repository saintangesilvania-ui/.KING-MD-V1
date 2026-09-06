const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'antispam',
    description: 'Anti-spam (messages répétés rapides) : .antispam on / .antispam off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'antispam');
            return sock.sendMessage(from, { text: `ℹ️ Anti-spam (messages répétés rapides) actuellement : ${current ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setToggle(from, 'antispam', state === 'on');
        await sock.sendMessage(from, { text: `✅ Anti-spam (messages répétés rapides) ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
