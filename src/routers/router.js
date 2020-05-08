const userRouter = require('./user')
const taskRouter = require('./task')

module.exports = (routesParams) => {
  routesParams.server.use(userRouter)
  routesParams.server.use(taskRouter)
}