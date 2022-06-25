import { Composer } from 'grammy'
import { bot } from '../bot.js'
import { prisma } from '../index.js'

const composer = new Composer()

composer.command("queue", async ctx => {
    if(ctx.from.id != process.env.OWNER) return
    
    const queue = await prisma.queue.findMany()
    const currentQueue = queue.reduce(
        ((acc, current) => {
            return 
                `${acc}\nCHAT ID: ${current.chat_id}` +
                `\nFilename: ${current.filename}` +
                `File ID: ${current.file_unique_id}`
        }), '')

    bot.api.sendMessage(process.env.OWNER, currentQueue ? currentQueue : "without any files")
})

export default composer