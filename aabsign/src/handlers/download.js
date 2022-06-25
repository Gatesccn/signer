import { Composer } from "grammy"
import { prisma } from "../index.js"
import { addToQueue } from "../etc/queue.js"
import fs from 'fs';
const composer = new Composer()

composer.on("message:document", async (ctx) => {
	let json = fs.readFileSync('ids.json', 'utf-8')
    json = JSON.parse(json).ids
    if (!json.find(v => v == ctx.from.id)) {
		return ctx.reply('PARA USAR DEBES HABLAR CON @GATESCCN!')
	}
	const { message_id, chat, document } = ctx.message
	const size = Math.round(document?.file_size / 1024 / 1024)
	if(size > 150)
		return ctx.reply('❌ You"ve passed the 150MB google play limit! EL LIMITE DE GOOGLE PLAY ES DE 150MB ⚙️')

	if (!document?.file_name?.endsWith(".aab")) return

	const exists = await prisma.queue.findFirst({
		where: {
			file_unique_id: document?.file_unique_id,
		},
	})
	const exists2 = await prisma.queue.findFirst({
		where: {
			chat_id: chat.id,
		},
	})
	
	const filename = document?.file_name
	var format = /[!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]+/;
	if(filename.indexOf(' ') >= 0)
       return await ctx.reply("❌ Please remove the space from the name 🦄 PORFAVOR ELIMINA LOS ESPACIOS EN EL NOMBRE")
	if(format.test(filename))
		return await ctx.reply("❌Its not allowed any special character in the name of the file 🦄 USA NOMBRES COMUMES O FACILES CORTOS\n❌Example of the prohibited characters:\n\n\n"+ format)
	
	
	if (exists)
		return await ctx.reply("❌ This file is already in the queue, please wait...   🦄 TU ARCHIVO SE A PUESTO EN COLA ESPERA 🦄")
	
	if (exists2)
		return await ctx.reply("❌ Sorry only 1 AAB at time, wait the first apk compile ! 🦄 Lo siento, solo 1 AAB a la vez, espere la primera compilación de apk")
	
	const queue = await prisma.queue.findMany()
	if (queue.length > 0) {
		addToQueue({
			message_id,
			chat_id: chat?.id,
			filename: document?.file_name,
			file_unique_id: document?.file_unique_id,
		})
		ctx.reply(
			` ✅ Your AAB has been added to the queue current position  🦄 TU ARCHIVO SE A PUESTO EN COLA : ${queue.length + 1} 🦄`,
			{
				reply_to_message_id: message_id,
			}
		)
		return
	}

	addToQueue({
		message_id,
		chat_id: chat?.id,
		filename: document?.file_name,
		file_unique_id: document?.file_unique_id,
	})
	}else
		 return ctx.reply('Send to @GATESCCN the bot is private because of scammers selling the acess to the bot')
	
})

export default composer
