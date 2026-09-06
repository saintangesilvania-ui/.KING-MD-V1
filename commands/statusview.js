const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

module.exports = {
    name: 'statusview',
    description: 'Voit automatiquement les statuts des contacts : .statusview on / .statusview off',
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return sock.sendMessage(from, { text: `ℹ️ Statusview : ${getSettings().statusview ? 'activé' : 'désactivé'}` }, { quoted: m });
        }
        setSettings({ statusview: state === 'on' });
        await sock.sendMessage(from, { text: `✅ Statusview ${state === 'on' ? 'activé' : 'désactivé'}.` }, { quoted: m });
    },
};
