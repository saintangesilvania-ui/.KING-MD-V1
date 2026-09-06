const axios = require('axios');

// ⚠️ Instagram bloque agressivement les scrapers non-officiels.
// Cette commande utilise une API publique tierce et peut casser sans préavis
// si Instagram change sa protection ou si l'API tierce ferme.
module.exports = {
    name: 'instagram',
    aliases: ['ig'],
    description: '(Best-effort, peut être instable) Télécharge un post Instagram : .instagram <lien>',
    async execute({ sock, m, from, args }) {
        const url = args[0];
        if (!url || !url.includes('instagram.com')) {
            return sock.sendMessage(from, { text: '⚠️ Donne un lien Instagram valide : .instagram https://instagram.com/p/xxxx' }, { quoted: m });
        }

        await sock.sendMessage(from, { text: '⏳ Téléchargement en cours... (Instagram est parfois capricieux)' }, { quoted: m });

        try {
            const { data } = await axios.get('https://api.tiklydown.eu.org/api/download', { params: { url } });
            const mediaUrl = data?.video?.url || data?.image?.url;
            if (!mediaUrl) throw new Error('Média introuvable (compte privé ou lien invalide)');

            const isVideo = !!data?.video?.url;
            await sock.sendMessage(
                from,
                isVideo ? { video: { url: mediaUrl } } : { image: { url: mediaUrl } },
                { quoted: m }
            );
        } catch (error) {
            console.error('Erreur instagram:', error.message);
            await sock.sendMessage(
                from,
                { text: `❌ Échec (Instagram bloque souvent ce type de requête) : ${error.message}` },
                { quoted: m }
            );
        }
    },
};
