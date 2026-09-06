const axios = require('axios');

module.exports = {
    name: 'mediafire',
    description: 'Télécharge un fichier depuis un lien Mediafire : .mediafire <lien>',
    async execute({ sock, m, from, args }) {
        const url = args[0];
        if (!url || !url.includes('mediafire.com')) return sock.sendMessage(from, { text: '⚠️ Lien Mediafire invalide.' }, { quoted: m });
        try {
            const { data: html } = await axios.get(url);
            const match = html.match(/href="(https:\/\/download[^"]+)"/);
            if (!match) throw new Error('Lien direct introuvable sur la page.');
            await sock.sendMessage(from, { document: { url: match[1] }, fileName: 'fichier', mimetype: 'application/octet-stream' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
