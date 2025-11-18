const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminname : { type: String, unique: true},
  email : { type: String },
  password : { type: String }
},{ timestamps: true } );

module.exports = mongoose.model("admin", adminSchema);