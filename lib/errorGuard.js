// Empêche une erreur inattendue de faire planter TOUT le serveur.
// Sans ça, une seule erreur non gérée quelque part (Baileys, une commande, etc.)
// peut arrêter tout le bot d'un coup — avec ça, elle est juste loggée et le bot continue.

function installErrorGuard() {
    process.on('uncaughtException', (err) => {
        console.error('🛑 Erreur non gérée (le bot continue quand même) :', err.message);
        console.error(err.stack);
    });

    process.on('unhandledRejection', (reason) => {
        console.error('🛑 Promesse rejetée non gérée (le bot continue quand même) :', reason);
    });
}

module.exports = { installErrorGuard };
