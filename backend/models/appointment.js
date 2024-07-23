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
  status: { type: String, enum: ['Wait for payment', 'Paid', 'Confirmed', 'Complete', 'Overdue'], default: 'Wait for payment', required: true },
  note: { type: String },
  userAttend: {type:Boolean, default:false}
});

// Sử dụng kiểm tra trước khi định nghĩa model
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
