const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'listsudo',
    description: 'Liste les admins actuels du bot',
    async execute({ sock, m, from }) {
        try {
            const list = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'admin.json'), 'utf8'));
            const text = list.length ? list.map((n) => `▸ ${n}`).join('\n') : '(aucun admin ajouté)';
            await sock.sendMessage(from, { text: `🛡️ Admins :\n${text}` }, { quoted: m });
        } catch {
            await sock.sendMessage(from, { text: '(aucun admin ajouté)' }, { quoted: m });
        }
    },
};
