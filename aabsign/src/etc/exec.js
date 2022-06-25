import { exec } from "child_process"

export default function(command){
	return new Promise((resolve, reject) => {
		exec(command, (err, stdout, stderr) =>
			stdout ? resolve(stdout) 
            : reject(err || stderr)
		)
	})
}