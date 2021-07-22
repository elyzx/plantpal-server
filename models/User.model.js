const { Schema, model } = require('mongoose');
let mongoose = require('mongoose');
require('./Plant.model');

const userSchema = new Schema ({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  location: String,
  password: String,
  plant: [{
    ref: 'Plant',
    type: mongoose.Schema.Types.ObjectId,
  }],
});

const User = model('User', userSchema);

module.exports = User;