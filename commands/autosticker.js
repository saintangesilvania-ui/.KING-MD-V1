const { checkGroupPermissions } = require('../lib/groupHelpers');
const { setToggle, isToggled } = require('../lib/groupSettings');

module.exports = {
    name: 'autosticker',
    description: 'Conversion auto des images envoyées en stickers : .autosticker on / .autosticker off',
    async execute({ sock, m, from, args }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            const current = isToggled(from, 'autosticker');
            return sock.sendMessage(from, { text: `ℹ️ Conversion auto des images envoyées en stickers actuellement : ${current ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setToggle(from, 'autosticker', state === 'on');
        await sock.sendMessage(from, { text: `✅ Conversion auto des images envoyées en stickers ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
