const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'goodbye',
    description: 'Active/désactive le message de départ : .goodbye on / .goodbye off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'goodbye');
            return sock.sendMessage(from, { text: `ℹ️ Message de départ actuellement : ${current ? 'activé' : 'désactivé'}\nUtilise .goodbye on ou .goodbye off` }, { quoted: m });
        }
        setToggle(from, 'goodbye', state === 'on');
        await sock.sendMessage(from, { text: `✅ Message de départ ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
