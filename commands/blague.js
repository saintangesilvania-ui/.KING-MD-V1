const BLAGUES = [
    "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent dans le bateau.",
    "Qu'est-ce qu'un crocodile qui surveille la pharmacie ? Un pharma-croc.",
    "Comment appelle-t-on un chat tout seul ? Un chat-solitaire.",
    "Pourquoi les poissons détestent l'ordinateur ? Parce qu'ils ont peur du net.",
    "Quel est le sport le plus silencieux ? Le para-chute.",
    "Qu'est-ce qui est jaune et qui attend ? Jonathan.",
    "Pourquoi le football c'est bien ? Parce qu'il y a une pelouse et pas de mauvaises herbes.",
    "Quel est le comble pour un électricien ? De ne pas être au courant.",
];

module.exports = {
    name: 'blague',
    aliases: ['joke'],
    description: 'Raconte une blague au hasard',
    async execute({ sock, m, from }) {
        const blague = BLAGUES[Math.floor(Math.random() * BLAGUES.length)];
        await sock.sendMessage(from, { text: `😂 ${blague}` }, { quoted: m });
    },
};
