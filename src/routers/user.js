const express = require('express')
const server = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../email/account')

server.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({user, token}) 
  } catch(err) {
    res.status(400).send(err)
  }
})

server.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()

    res.send({user, token})
  } catch (e) {
    res.status(400).send(e)
  }
})

server.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()

    res.send()
  } catch (err) {
    res.status(500).send(err)
  }
})

server.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (err) {
    res.status(500).send(err)
  }
})

server.get('/users/me',auth, async (req, res) => {
  res.send(req.user)
})

server.get('/users/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const user = await User.findById(_id)
    if(!user) return res.status(404).send()
    res.send(user)
  } catch (err) {
    console.log(err)
    res.status(404).send(err)
  }
})

server.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedColumns = ['name', 'age', 'password', 'email']
  const isAllowed = updates.every(update => allowedColumns.includes(update))

  if (!isAllowed) return res.status(400).send("Invalid updates!")

  try {
    
    // better way to save
    updates.forEach(key => req.user[key] = req.body[key])

    await req.user.save()

    // call mongoose api to save
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.send(req.user)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

server.delete('/users/me', auth, async (req, res) => {
  try {
    sendCancelEmail(req.user.email, req.user.name)
    await req.user.remove()
    res.send(req.user)
  } catch (err) {
    res.status(500).send(err)
  }
})

const upload = multer({
  // dest: 'avatar',
  // define file size
  limits: {
    fileSize: 1000000
  },
  // filter file type
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Plz upload a image'))
    }

    callback(undefined, true)

  }
})

server.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message})
})

server.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message})
})

server.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar) throw new Error('No Avatar')
    console.log(user.avatar)
    res.set('Content-Type', 'image/png').send(user.avatar)
    // res.send(user.avatar)
  } catch (e) {
    res.status(400).send(e)
  }
})


module.exports = server