const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'statuslike',
    description: 'Like automatique des statuts des contacts : .statuslike on / .statuslike off',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ Like automatique des statuts des contacts : ${getSettings().statusLike ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setSettings({ statusLike: state === 'on' });
        await sock.sendMessage(from, { text: `✅ Like automatique des statuts des contacts ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
