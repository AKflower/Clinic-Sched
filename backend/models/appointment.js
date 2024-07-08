const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  date: { type: Date, required: true },
  timeId: { type: Number, ref: 'TimeSlot', required: true },
  status: { type: String, required: true },
  note: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
