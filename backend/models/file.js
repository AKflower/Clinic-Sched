const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const fileSchema = new mongoose.Schema({
  fileid: {
    type: Number
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  symptom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null,
  },
  createdDate: {
    type: Date,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  result: {
    type: String,
    default: null
  }
});

fileSchema.plugin(AutoIncrement, { inc_field: 'fileid' });

module.exports = mongoose.model('File', fileSchema);
