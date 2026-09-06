const { startGame, getGame, endGame } = require('../lib/ticTacToe');

module.exports = {
    name: 'titato',
    aliases: ['tictactoe', 'morpion'],
    description: "Lance une partie de morpion : mentionne ton adversaire, ex. .titato @quelqu'un",
    async execute({ sock, m, from }) {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const opponent = mentioned || m.message.extendedTextMessage?.contextInfo?.participant;
        const challenger = m.key.participant || from;

        if (!opponent) {
            return sock.sendMessage(from, { text: "⚠️ Mentionne ton adversaire : .titato @quelqu'un" }, { quoted: m });
        }
        if (opponent === challenger) {
            return sock.sendMessage(from, { text: '⚠️ Tu ne peux pas jouer contre toi-même.' }, { quoted: m });
        }
        if (getGame(from)) {
            return sock.sendMessage(from, { text: '⚠️ Une partie est déjà en cours ici. Tape .endgame pour l\'arrêter.' }, { quoted: m });
        }

        const game = startGame(from, challenger, opponent);
        await sock.sendMessage(
            from,
            {
                text: `🎮 *Morpion !*\n@${challenger.split('@')[0]} (❌) vs @${opponent.split('@')[0]} (⭕)\n\n${require('../lib/ticTacToe').renderBoard(game.board)}\n\n@${challenger.split('@')[0]}, à toi ! Réponds avec un numéro (1-9).`,
                mentions: [challenger, opponent],
            },
            { quoted: m }
        );
    },
};
