const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String , unique: true },
  age: { type: Number },
  city: { type: String },
  gender: { type: String },
  pincode: { type: Number },
  image: { type: String }
}, { timestamps: true } );

module.exports = mongoose.model( "users2" , userSchema);