const axios = require('axios');

// Compatible avec toute API de type "OpenAI chat completions"
// (OpenAI, Groq, OpenRouter, Together.ai, etc. — configure juste l'URL et la clé).
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

async function askAI(userPrompt, systemPrompt = 'Tu es un assistant utile et concis.') {
    if (!AI_API_KEY) {
        throw new Error("Aucune clé IA configurée. Ajoute AI_API_KEY (et éventuellement AI_API_URL, AI_MODEL) dans les variables d'environnement Render.");
    }

    const { data } = await axios.post(
        AI_API_URL,
        {
            model: AI_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        },
        { headers: { Authorization: `Bearer ${AI_API_KEY}` }, timeout: 30000 }
    );

    return data?.choices?.[0]?.message?.content?.trim() || '(réponse vide)';
}

module.exports = { askAI };
