const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String },
  birth: { type: Date },
  role: { type: String, enum: ['admin'], default: 'admin', required: true },
});

module.exports = mongoose.model('Admin', adminSchema);
