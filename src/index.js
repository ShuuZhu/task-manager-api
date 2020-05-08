const express = require('express')

const router = require('./routers/router')
require('./db/mongoose')

const server = express()
const port = process.env.PORT


server.use(express.json())
router({server})

server.listen(port, () => {
  console.log("The server is start by " + port)
})
