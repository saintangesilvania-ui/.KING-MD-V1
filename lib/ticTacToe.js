const games = new Map();

const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

function renderBoard(board) {
    const c = board.map((v, i) => v || ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'][i]);
    return `${c[0]}${c[1]}${c[2]}\n${c[3]}${c[4]}${c[5]}\n${c[6]}${c[7]}${c[8]}`;
}

function checkWinner(board) {
    for (const [a, b, c] of LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every((v) => v)) return 'draw';
    return null;
}

function startGame(chatJid, player1, player2) {
    const game = {
        board: Array(9).fill(null),
        players: [player1, player2],
        turn: player1,
        symbols: { [player1]: '❌', [player2]: '⭕' },
    };
    games.set(chatJid, game);
    return game;
}

function getGame(chatJid) {
    return games.get(chatJid);
}

function endGame(chatJid) {
    games.delete(chatJid);
}

function playMove(chatJid, playerJid, position) {
    const game = games.get(chatJid);
    if (!game) return { error: "Aucune partie en cours ici. Lance-en une avec .titato @adversaire" };
    if (!game.players.includes(playerJid)) return { error: "T'es pas dans cette partie." };
    if (game.turn !== playerJid) return { error: "C'est pas ton tour." };
    if (position < 0 || position > 8) return { error: 'Case invalide (1 à 9).' };
    if (game.board[position]) return { error: 'Case déjà prise.' };

    game.board[position] = game.symbols[playerJid];
    const winner = checkWinner(game.board);
    if (winner === 'draw') {
        endGame(chatJid);
        return { board: renderBoard(game.board), draw: true };
    }
    if (winner) {
        endGame(chatJid);
        return { board: renderBoard(game.board), winner: playerJid };
    }
    game.turn = game.players.find((p) => p !== playerJid);
    return { board: renderBoard(game.board), nextTurn: game.turn };
}

module.exports = { startGame, getGame, endGame, playMove, renderBoard };
