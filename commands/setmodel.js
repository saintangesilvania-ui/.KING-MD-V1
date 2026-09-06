const { isOwner } = require('../lib/permissions');
const { getSettings, setSettings } = require('../lib/botSettings');

// Presets connus (API + modèle) — l'utilisateur doit quand même fournir sa propre clé
// dans AI_API_KEY, mais ça évite de retaper l'URL à chaque fois.
const PRESETS = {
    openai: { url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
    groq: { url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
    openrouter: { url: 'https://openrouter.ai/api/v1/chat/completions', model: 'deepseek/deepseek-chat' },
    mistral: { url: 'https://api.mistral.ai/v1/chat/completions', model: 'mistral-large-latest' },
};

module.exports = {
    name: 'setmodel',
    description: `Change le fournisseur IA utilisé par .ai (${Object.keys(PRESETS).join(', ')}) : .setmodel groq`,
    async execute({ sock, m, from, args }) {
        if (!isOwner(m.key.participant || m.key.remoteJid)) return sock.sendMessage(from, { text: '⛔ Owner uniquement.' }, { quoted: m });
        const choice = args[0]?.toLowerCase();
        const preset = PRESETS[choice];
        if (!preset) {
            return sock.sendMessage(from, { text: `⚠️ Choix : ${Object.keys(PRESETS).join(', ')}\n\nNote : il faut quand même définir AI_API_KEY (la bonne clé pour ce fournisseur) dans les variables d'environnement.` }, { quoted: m });
        }
        setSettings({ aiProvider: choice, aiUrl: preset.url, aiModel: preset.model });
        await sock.sendMessage(from, { text: `✅ Fournisseur IA : ${choice} (${preset.model})\n⚠️ Assure-toi que AI_API_KEY correspond bien à ce fournisseur.` }, { quoted: m });
    },
};
