const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const timeSlotSchema = new mongoose.Schema({
  timeid: { type: Number },
  name: { type: String, required: true },
  time: { type: String, required: true }
});

// Tự động tăng id sau mỗi lần tạo
timeSlotSchema.plugin(AutoIncrement, { inc_field: 'timeid' });


module.exports = mongoose.model('TimeSlot', timeSlotSchema);
