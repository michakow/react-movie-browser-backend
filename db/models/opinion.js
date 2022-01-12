const mongoose = require('mongoose')

const opinionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  author: {
    type: String
  }
})

const Opinion = mongoose.model('Opinion', opinionSchema, "opinions")

module.exports = Opinion