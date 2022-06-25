import exec from "./exec.js"
import fs from 'fs'
import { existsSync } from "fs"

export default async function(filename) {
	try {

		const aabFilename = filename.replace(".aab", "-signed.aab")
		let log = await exec(`jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore /root/aabsign/key.jks ${filename} key0 -keypass 123456 -storepass 123456 >> ${filename}.logs && cp ${filename} ${aabFilename}`)
	
		console.log(filename, aabFilename, existsSync(aabFilename))
		return {
			logs: log,
			exists: existsSync(aabFilename),
			aabFilename,
		}
	} catch (err) {
		return {
			exists: false,
			logs: err.toString(),
			error: err.message
		}
	}
}
