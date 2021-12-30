const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: String,
    required: true
  },
  favMoviesID: {
    type: Array
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User