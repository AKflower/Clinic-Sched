const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const fileSchema = new mongoose.Schema({
  fileid: {
    type: Number
  },
  symptom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  }
});

fileSchema.plugin(AutoIncrement, { inc_field: 'fileid' });

module.exports = mongoose.model('File', fileSchema);
