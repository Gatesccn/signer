import './errors.js'
import { bot } from '../bot.js'
import download from './download.js'
import start from './start.js'
import queueView from './queueView.js'

export default function() {
    bot.use(download)
    bot.use(start)
    bot.use(queueView)
}