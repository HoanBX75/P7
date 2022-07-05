const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userPostSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Number, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserPost', userPostSchema);
