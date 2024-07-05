const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['guest', 'user', 'admin'], default: 'guest' },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
});

module.exports = mongoose.model('User', userSchema);
