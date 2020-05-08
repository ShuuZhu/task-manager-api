const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)) throw new Error('Email is wrong')
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      // condition can be value.toLowerCase().includes('password') too
      if(validator.contains(value.toLowerCase(), 'password'))  throw new Error('Your password contain string "password"!')
    }
  },
  age : {
    type: Number,
    default: 20,
    validate(value){
      if(value < 0) {
        throw new Error('age must more than 0')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, { 
  timestamps: true
})

// Virtual Properties
// Relation Collection

userSchema.virtual('user_task', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
  const user = this
  const result = user.toObject()

  delete result.password
  delete result.tokens
  delete result.avatar

  return result
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {expiresIn: '7 days'})

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token

}

userSchema.statics.findByCredentials = async (email, password) => {
 const user = await User.findOne({ email })

 if (!user)  throw new Error('Unable to login (No user be found)')

 const isMatch = await bcrypt.compare(password, user.password)

 if(!isMatch) throw new Error('Unable to login (Wrong password)')

 return user
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({owner: user._id})
  next()
})

const User = mongoose.model('User', userSchema)


module.exports = User