const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  userId: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP sẽ hết hạn sau 5 phút
});

module.exports = mongoose.model('OTP', otpSchema);
