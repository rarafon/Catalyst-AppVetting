const mongoose = require('mongoose');

const careContactSchema = new mongoose.Schema({
  applicant_id: mongoose.ObjectId,
  name: String,
  relationship: String,
  phone: String,
  email: String,
});

module.exports = mongoose.model('CareContact', careContactSchema);;