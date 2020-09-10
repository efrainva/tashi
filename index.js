const server = require('./server')

const PORT = 80

server.listen(PORT,() => console.log(`running: ${PORT} `))

