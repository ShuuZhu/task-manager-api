// CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const tasks = [{
  description: 'Learning Node.js',
  completed: false
}, {
  description: 'Play FIFA 2K18',
  completed: false
}, {
  description: 'Accompany wity wife and daughter',
  completed: false
}]

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) return console.log('Unable to connect to database!!')

  const db = client.db(databaseName)

  // Create

  // db.collection('users').insertOne({
  //   _id: id,
  //   name: 'Jay',
  //   age: 27
  // }, (error, result) => {
  //   if (error) return console.log('Unable to Insert')
  //   console.log(result.ops)
  // })

  // db.collection('tasks').insertMany(tasks, (error, result) => {
  //   if (error) return console.log('Unable to InsertMany.')
  //   console.log(result.ops)
  // })

  // Read

  // db.collection('tasks').findOne({_id : new ObjectID("5e7b0ea2d4bff7634707af59")}, (error, tasks) => {
  //   console.log(tasks)
  // })

  // db.collection('tasks').find({completed: false}).toArray((error, result) => {
  //   console.log(result)
  // })

  // Update

  // db.collection('tasks').updateOne({_id:  new ObjectID("5e7b0ea2d4bff7634707af59")}, {
  //   $set: {
  //     completed: true
  //   }
  // }).then(result => {
  //   console.log(result)
  // }).catch(err => {
  //   console.log(err)
  // })

  // db.collection('tasks').updateMany({completed: false}, {
  //   $set: {
  //     completed: true
  //   }
  // }).then(result => {
  //   console.log(result)
  // }).catch(err => {
  //   console.log(err)
  // })

  // Delete

  // db.collection('tasks').deleteOne({ _id: new ObjectID("5e7b0ea2d4bff7634707af59") }).then(result => {
  //   console.log(result)
  // }).catch(err => {
  //   console.log(err)
  // })

  // db.collection('tasks').deleteMany({ completed: true }).then(result => {
  //   console.log(result)
  // }).catch(err => {
  //   console.log(err)
  // })
})