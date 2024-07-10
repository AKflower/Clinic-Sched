const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String},
  birth: { type: Date },
  role: { type: String, enum: ['doctor'], default: 'doctor', required: true },
  department: [{ type: Schema.Types.ObjectId, ref: 'Department', required: true }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  dayOff: [
    {
      date: { type: Date, required: true },
      reason: { type: String, required: true }
    }
  ],
  isActive: { type: Boolean, required: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);
