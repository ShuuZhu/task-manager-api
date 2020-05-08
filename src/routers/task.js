const express = require('express')
const server = express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')

server.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })


  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

// GET /task?completed=true
// GET /task?limit=10&skip=20
// GET /task?sortBy=createdAt:desc
server.get('/tasks', auth, async (req, res) => {
  const match = req.query.completed ? { completed: req.query.completed === 'true' } : {}
  const sort = {}

  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    await req.user.populate({
      path: 'user_task',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    // if(!tasks) return res.status(404).send()
    res.send(req.user.user_task)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }

})

server.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, owner: req.user._id})
    if(!task) return res.status(404).send()
    res.send(task)
  } catch (err) {
    res.status(404).send(err)
  }
})

server.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedColumns = ['completed', 'description']
  const isAllowed = updates.every(update => allowedColumns.includes(update))

  if(!isAllowed) return res.status(400).send('Invalid update!')

  try {
    // const task = await Task.findById(req.params.id)
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

    if (!task) return res.status(404).send('No task be found')

    updates.forEach(key => task[key] = req.body[key])

    await task.save()
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

server.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

    if (!task) return res.status(404).send()

    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = server