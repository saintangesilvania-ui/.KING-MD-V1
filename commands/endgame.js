const { getGame, endGame } = require('../lib/ticTacToe');

module.exports = {
    name: 'endgame',
    description: 'Arrête la partie de morpion en cours dans cette discussion',
    async execute({ sock, m, from }) {
        if (!getGame(from)) return sock.sendMessage(from, { text: 'ℹ️ Aucune partie en cours ici.' }, { quoted: m });
        endGame(from);
        await sock.sendMessage(from, { text: '🛑 Partie arrêtée.' }, { quoted: m });
    },
};
