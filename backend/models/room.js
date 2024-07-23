const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date },
  status: {type: Number, default:0},
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
