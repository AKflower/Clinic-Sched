const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, enum: ['user'], default: 'user', required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  isActive: { type: Boolean, required: true,  default: true},
});

module.exports = mongoose.model('User', userSchema);
