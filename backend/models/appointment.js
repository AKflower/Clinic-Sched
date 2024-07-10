const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room'},
  date: { type: Date, required: true },
  timeId: { type: Number, ref: 'TimeSlot', required: true },
  status: { type: String, enum: ['Wait for confirmation', 'Confirmed', 'Complete', 'Overdue'], default: 'Wait for confirmation', required: true },
  note: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
