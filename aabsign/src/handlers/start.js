import { Composer } from 'grammy'
import { InlineKeyboard } from 'grammy'

const keyboard = new InlineKeyboard()
    .url("Telegram Channel", "https://t.me/latamsrc")
    
const composer = new Composer()
composer.command('start', ctx => {
    const { from } = ctx
    ctx.reply(
        `Hello, <a href="tg://user?id=${from?.id}">${from?.first_name} ${from?.last_name?? ''}</a>`+
        `\nTo use the bot, just send the AAB to SIGN it`+
        `\nPs: <b>This bot is under maintenance make a donation to use.</b>` +
        `\n\nPS 2: <b>No spaces in the name due to unicodes</b>`,
        `\nPara usar el bot, simplemente envíe el AAB para FIRMARLO`+
        `\nPs: <b>Este bot esta en mantenimiento realiza una donacion para usar.</b>` +
        `\n\nPS 2: <b>Sin espacios en el nombre debido a Unicodes</b>`,
        { parse_mode: 'HTML', reply_markup: keyboard }
    )
})

export default composer