import { config } from 'dotenv'
config()
import { Bot } from 'grammy'
import { TelegramClient, sessions, Logger } from 'telegram'

const { API_ID, API_HASH, TOKEN } = process.env
const stringSession = new sessions.StringSession('')
const client = new TelegramClient(stringSession, Number(API_ID), API_HASH)
Logger.setLevel('none')

await client.start({
    botAuthToken: TOKEN,
    onError: (err) => console.log(err)
})

const bot = new Bot(TOKEN)

export {
    client, bot
}
