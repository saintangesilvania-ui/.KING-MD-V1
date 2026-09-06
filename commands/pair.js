const { getConfig } = require('../lib/config');

module.exports = {
    name: 'pair',
    description: 'Affiche le lien pour connecter un autre numéro au bot',
    async execute({ sock, m, from }) {
        const cfg = getConfig();
        if (!cfg.botUrl) {
            return sock.sendMessage(from, { text: 'ℹ️ Aucun lien configuré pour l\'instant.' }, { quoted: m });
        }
        await sock.sendMessage(
            from,
            { text: `🔗 Pour connecter un numéro au bot :\n${cfg.botUrl}\n\nEntre ton numéro avec l'indicatif pays, sans le +.` },
            { quoted: m }
        );
    },
};
