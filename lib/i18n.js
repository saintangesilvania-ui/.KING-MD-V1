const { getConfig } = require('./config');

const STRINGS = {
    ownerOnly: {
        fr: '⛔ Réservé au propriétaire du bot.',
        en: '⛔ Owner only.',
        es: '⛔ Solo para el propietario del bot.',
    },
    adminOnly: {
        fr: '⛔ Réservé aux admins.',
        en: '⛔ Admins only.',
        es: '⛔ Solo para administradores.',
    },
    groupOnly: {
        fr: '⚠️ Cette commande ne marche que dans un groupe.',
        en: '⚠️ This command only works in a group.',
        es: '⚠️ Este comando solo funciona en un grupo.',
    },
    genericError: {
        fr: '❌ Une erreur est survenue.',
        en: '❌ An error occurred.',
        es: '❌ Ocurrió un error.',
    },
    menuOwner: { fr: 'Owner', en: 'Owner', es: 'Propietario' },
    menuName: { fr: 'Nom', en: 'Name', es: 'Nombre' },
    menuCommands: { fr: 'commandes', en: 'commands', es: 'comandos' },
    menuPrefix: { fr: 'Préfixe', en: 'Prefix', es: 'Prefijo' },
    menuMode: { fr: 'Mode', en: 'Mode', es: 'Modo' },
    langChanged: {
        fr: '✅ Langue changée pour : Français',
        en: '✅ Language changed to: English',
        es: '✅ Idioma cambiado a: Español',
    },
};

const SUPPORTED = ['fr', 'en', 'es'];

function getLang() {
    const lang = getConfig().lang;
    return SUPPORTED.includes(lang) ? lang : 'fr';
}

function t(key) {
    const lang = getLang();
    return STRINGS[key]?.[lang] || STRINGS[key]?.fr || key;
}

module.exports = { t, getLang, SUPPORTED };
