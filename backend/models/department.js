const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, required: true,  default: true},
});

module.exports = mongoose.model('Department', departmentSchema);
