require('dotenv').config();

const express = require('express');
const compression = require('compression');
const path = require('path');
const QRCode = require('qrcode');
const { connectToWhatsApp, connectViaQR } = require('./whatsapp');
const { startCleanupLoop } = require('./lib/cleanup');
const { installErrorGuard } = require('./lib/errorGuard');

installErrorGuard();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(compression());
app.use(express.static(__dirname));

app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/code', async (req, res) => {
    const number = req.query.number;
    if (!number) {
        return res.status(400).json({ error: 'Numéro requis (ex: /code?number=50912345678)' });
    }
    try {
        const code = await connectToWhatsApp(number);
        res.json({ code: code || 'Déjà connecté' });
    } catch (error) {
        console.error('❌ Erreur /code:', error.message);
        // 409 : une demande est déjà en cours — on ne renvoie surtout pas un code trompeur.
        if (error.code === 'PAIRING_IN_PROGRESS') {
            return res.status(409).json({ error: 'Appairage déjà en cours', detail: error.message });
        }
        console.error(error.stack);
        res.status(503).json({ error: 'Service Unavailable', detail: error.message });
    }
});

app.get('/qr', async (req, res) => {
    try {
        const qrString = await connectViaQR();
        const pngBuffer = await QRCode.toBuffer(qrString, { width: 320, margin: 2 });
        res.set('Content-Type', 'image/png');
        res.send(pngBuffer);
    } catch (error) {
        console.error('❌ Erreur /qr:', error.message);
        res.status(503).json({ error: 'Service Unavailable', detail: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    startCleanupLoop();

    if (process.env.SESSION_ID && process.env.SESSION_NUMBER) {
        console.log('♻️ Tentative de reconnexion automatique via SESSION_ID...');
        connectToWhatsApp(process.env.SESSION_NUMBER).catch((e) =>
            console.error('❌ Reconnexion automatique échouée:', e.message)
        );
    }
});
