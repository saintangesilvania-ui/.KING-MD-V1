const { checkGroupPermissions } = require('../lib/groupHelpers');
const { bufferFromMessage, getMediaMessage } = require('../lib/media');

module.exports = {
    name: 'gcpp',
    description: 'Change la photo du groupe (réponds à une image avec .gcpp)',
    async execute({ sock, m, from }) {
        const perm = await checkGroupPermissions(sock, m, from);
        if (!perm.ok) return sock.sendMessage(from, { text: perm.reason }, { quoted: m });
        const media = getMediaMessage(m);
        if (!media || media.type !== 'image') return sock.sendMessage(from, { text: '⚠️ Réponds à une image.' }, { quoted: m });
        try {
            const buffer = await bufferFromMessage(media.message, 'image');
            await sock.updateProfilePicture(from, buffer);
            await sock.sendMessage(from, { text: '✅ Photo du groupe changée.' }, { quoted: m });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ ${error.message}` }, { quoted: m });
        }
    },
};
