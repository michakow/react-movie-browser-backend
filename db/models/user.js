const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
  },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
