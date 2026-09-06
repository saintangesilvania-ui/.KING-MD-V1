const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'welcome',
    description: 'Active/désactive le message de bienvenue : .welcome on / .welcome off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'welcome');
            return sock.sendMessage(from, { text: `ℹ️ Bienvenue actuellement : ${current ? 'activée' : 'désactivée'}\nUtilise .welcome on ou .welcome off` }, { quoted: m });
        }
        setToggle(from, 'welcome', state === 'on');
        await sock.sendMessage(from, { text: `✅ Message de bienvenue ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
