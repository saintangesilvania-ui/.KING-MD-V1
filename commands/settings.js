module.exports = {
    name: 'settings',
    description: 'Affiche tous les réglages actuels du bot',
    async execute({ sock, m, from }) {
        const { getSettings } = require('../lib/botSettings');
        const { getConfig } = require('../lib/config');
        const s = getSettings();
        const c = getConfig();
        const text = [
            '⚙️ *Réglages du bot*',
            `Nom : ${s.botName}`,
            `Owner : ${s.ownerName}`,
            `Préfixe : ${c.prefix}`,
            `Mode : ${s.mode}`,
            `Description : ${s.description}`,
            `Nom des stickers : ${s.stickerName}`,
            `Statut "en ligne" forcé : ${s.online ? 'oui' : 'non'}`,
            `Like auto des statuts : ${s.statusLike ? 'oui' : 'non'}`,
        ].join('\n');
        await sock.sendMessage(from, { text }, { quoted: m });
    },
};
