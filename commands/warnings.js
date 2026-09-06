const { isGroup, extractTarget } = require('../lib/groupHelpers');
const { getWarnings } = require('../lib/groupSettings');

module.exports = {
    name: 'warnings',
    description: "Affiche le nombre d'avertissements d'un membre",
    async execute({ sock, m, from }) {
        if (!isGroup(from)) return sock.sendMessage(from, { text: '⚠️ Marche seulement dans un groupe.' }, { quoted: m });

        const target = extractTarget(m) || m.key.participant;
        const count = getWarnings(from, target.replace(/[^0-9]/g, ''));
        await sock.sendMessage(from, { text: `⚠️ ${count}/3 avertissement(s).` }, { quoted: m });
    },
};
