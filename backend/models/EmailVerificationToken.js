const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailVerificationTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Token sẽ hết hạn sau 1 giờ
});

module.exports = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);
