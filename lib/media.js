const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function bufferFromMessage(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

// Récupère le message cité (réponse) ou le message lui-même s'il contient un média
function getMediaMessage(m) {
    const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage) return { message: quoted.imageMessage, type: 'image' };
    if (quoted?.videoMessage) return { message: quoted.videoMessage, type: 'video' };
    if (m.message.imageMessage) return { message: m.message.imageMessage, type: 'image' };
    if (m.message.videoMessage) return { message: m.message.videoMessage, type: 'video' };
    return null;
}

module.exports = { bufferFromMessage, getMediaMessage };
