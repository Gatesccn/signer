import { prisma } from "../index.js"
import { client, bot } from "../bot.js"
import { writeFile, rm } from "fs/promises"
import convertFile from "./convertFile.js"

const sendMessage = async ({ chat_id, filename }) => {
	await bot.api
		.sendMessage(chat_id, ` ⚙️Starting the signing of the file: \`${filename}\` 🦄`, {
			parse_mode: "Markdown",
		})
		.catch(() => console.log("Error al enviar mensaje"))
}

const createLogsAndRemove = async (chatId, filename, logs) => {
  const currentFilename = `temp/${filename}.logs`
  console.log(currentFilename)
  //await writeFile(currentFilename, logs)
  await client.sendFile(chatId, {
    file: currentFilename,
    workers: 4,
    caption: " ⚙️ Aquí están los registros del proceso. ¡Y SI EL BOT ES GRATIS!, MI GRUPO @https://t.me/Smandchat🦄",
  })
  
  await client.sendFile(chatId, {
    file: `temp/${filename.replace(".aab", "-signed.aab")}`,
    workers: 4
  })
  await rm(currentFilename)
  await rm(`temp/${filename}`).catch(() => console.log( "❌ Error on erased file 🦄"))
  await rm(`temp/${filename.replace(".aab", "-signed.aab")}`)
    .catch(() => console.log("❌ Error en el archivo borrado firmado.aab 🦄"))
}

const uploadFiles = async (items) => {
	if (items.length == 0) {
		return await prisma.running.deleteMany({
			where: { on_queue: true },
		})
	}

	const current = items.shift()
	await sendMessage({ chat_id: current.chat_id, filename: current.filename})

	const message = (
		await client.getMessages(current.chat_id, 
			{ids: current.message_id,}
		)
	).shift()

	try {
		const buffer = await client.downloadMedia(message.media, {
			workers: 4,
		})
		const path = `temp/${current.filename}`
		await writeFile(path, buffer)
		await prisma.queue.deleteMany({
			where: { file_unique_id: current.file_unique_id },
		})
		const convert = await convertFile(path)
		if (!convert.exists) {
			console.log('not exist', path, convert.error, current.filename)
			createLogsAndRemove(current.chat_id, current.filename, convert.logs)
			return uploadFiles(await prisma.queue.findMany())
		}
		console.log('exist', path, convert.exists, current.filename)
		await client.sendFile(current.chat_id, {
			file: convert.aabFilename,
			workers: 1,
		})
		createLogsAndRemove(current.chat_id, current.filename, convert.logs)
	} catch ({ message }) {
		await prisma.queue.deleteMany({
			where: { file_unique_id: current.file_unique_id },
		})
		await bot.api.sendMessage(current.chat_id, "❌ Algo SALIO MAL por favor reenviar el apk ! 🦄")
	}
	uploadFiles(await prisma.queue.findMany())
}

export const addToQueue = async ({
	message_id,
	chat_id,
	filename,
	file_unique_id,
}) => {
	const OnQueue = await prisma.running.findFirst({
		where: {
			on_queue: true,
		},
	})
	if (OnQueue)
		return await prisma.queue.create({
			data: { message_id, chat_id, filename, file_unique_id },
		})

	await prisma.queue.create({
		data: { message_id, chat_id, filename, file_unique_id },
	})
	await prisma.running.create({
		data: { on_queue: true },
	})
	const queue = await prisma.queue.findMany()
	uploadFiles(queue)
		.catch((err) => console.log('Hubo un error al enviar a un usuario', err))
}
