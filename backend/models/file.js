const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const fileSchema = new mongoose.Schema({
  fileid: {
    type: Number
  },
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
