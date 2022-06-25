import { bot } from './bot.js'
import init from './handlers/index.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

export const prisma = new PrismaClient()

init()
bot.catch(({ message }) => console.log(message))
bot.start()