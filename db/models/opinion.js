const mongoose = require('mongoose')

const opinionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: String
  }
})

const Opinion = mongoose.model('Opinion', opinionSchema)

module.exports = Opinion