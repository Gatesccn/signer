process.on('unhandledRejection', (reason, _) => {
    console.log(`Error: ${reason?.message ?? reason}`)
})