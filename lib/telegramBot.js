// Interface Telegram pour connecter WhatsApp — alternative au site web.
// Activée uniquement si TELEGRAM_BOT_TOKEN est configuré (sinon complètement ignorée).
const { Telegraf, Markup } = require('telegraf');
const QRCode = require('qrcode');

const awaitingPhoneNumber = new Set();

const WELCOME_TEXT =
    '👑 *BIENVENUE SUR KING-MD*\n\n' +
    '_Le panneau de contrôle pour connecter ton compte WhatsApp._';

function mainMenu() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('🟢 Connecter WhatsApp', 'connect_whatsapp')],
        [Markup.button.callback('ℹ️ Aide', 'help')],
    ]);
}

function connectMethodMenu() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('📷 QR Code', 'connect_qr')],
        [Markup.button.callback('🔢 Code de jumelage', 'connect_pairing')],
        [Markup.button.callback('⬅️ Retour', 'back_to_main')],
    ]);
}

function backButton() {
    return Markup.inlineKeyboard([[Markup.button.callback('⬅️ Retour', 'back_to_main')]]);
}

function startTelegramBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        console.log('ℹ️ TELEGRAM_BOT_TOKEN non configuré — interface Telegram désactivée.');
        return null;
    }

    const { connectToWhatsApp, connectViaQR } = require('../whatsapp');
    const bot = new Telegraf(token);

    bot.start((ctx) => {
        awaitingPhoneNumber.delete(ctx.from.id);
        return ctx.reply(WELCOME_TEXT, { parse_mode: 'Markdown', ...mainMenu() });
    });

    bot.action('back_to_main', async (ctx) => {
        await ctx.answerCbQuery();
        awaitingPhoneNumber.delete(ctx.from.id);
        return ctx.editMessageText(WELCOME_TEXT, { parse_mode: 'Markdown', ...mainMenu() });
    });

    bot.action('connect_whatsapp', async (ctx) => {
        await ctx.answerCbQuery();
        return ctx.editMessageText(
            '🟢 *CONNECTER WHATSAPP*\n\nChoisis ta méthode :\n\n' +
                '📷 *QR Code* — scanne depuis WhatsApp > Appareils liés\n' +
                '🔢 *Code de jumelage* — entre ton numéro, reçois un code à saisir',
            { parse_mode: 'Markdown', ...connectMethodMenu() }
        );
    });

    bot.action('connect_qr', async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.editMessageText('📷 *Génération du QR code...*', { parse_mode: 'Markdown' });
        try {
            const qrString = await connectViaQR();
            const buffer = await QRCode.toBuffer(qrString, { width: 320, margin: 2 });
            await ctx.replyWithPhoto(
                { source: buffer },
                {
                    caption: '📲 Scanne ce QR code depuis WhatsApp > Appareils liés > Lier un appareil.\nIl expire après ~20 secondes.',
                }
            );
        } catch (err) {
            await ctx.reply(`❌ ${err.message}`);
        }
    });

    bot.action('connect_pairing', async (ctx) => {
        await ctx.answerCbQuery();
        awaitingPhoneNumber.add(ctx.from.id);
        return ctx.editMessageText(
            '🔢 *CODE DE JUMELAGE*\n\nEnvoie ton numéro WhatsApp avec l\'indicatif pays, *sans le +* (ex: `50912345678`).',
            { parse_mode: 'Markdown', ...backButton() }
        );
    });

    bot.on('text', async (ctx, next) => {
        if (!awaitingPhoneNumber.has(ctx.from.id)) return next();
        awaitingPhoneNumber.delete(ctx.from.id);
        const number = ctx.message.text.trim();

        const waitMsg = await ctx.reply('⏳ Génération du code...');
        try {
            const code = await connectToWhatsApp(number);
            await ctx.telegram.editMessageText(
                waitMsg.chat.id,
                waitMsg.message_id,
                undefined,
                code
                    ? `🔢 *TON CODE*\n\n\`${code}\`\n\nWhatsApp > Appareils liés > Lier un appareil > Lier avec le numéro de téléphone.\nExpire vite, entre-le rapidement !`
                    : '✅ Ce numéro est déjà connecté.',
                { parse_mode: 'Markdown' }
            );
        } catch (err) {
            await ctx.telegram.editMessageText(waitMsg.chat.id, waitMsg.message_id, undefined, `❌ ${err.message}`);
        }
    });

    bot.action('help', async (ctx) => {
        await ctx.answerCbQuery();
        const text =
            'ℹ️ *COMMENT UTILISER KING-MD*\n\n' +
            '1️⃣ Clique sur CONNECTER WHATSAPP\n' +
            '2️⃣ Choisis QR code ou code de jumelage\n' +
            '3️⃣ Suis les instructions\n' +
            '4️⃣ Une fois connecté, tape `.menu` dans WhatsApp';
        return ctx.editMessageText(text, { parse_mode: 'Markdown', ...backButton() });
    });

    bot.catch((err) => console.error('Erreur Telegram:', err.message));

    bot.launch().then(() => console.log('🤖 Interface Telegram en ligne.'));
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    return bot;
}

module.exports = { startTelegramBot };
