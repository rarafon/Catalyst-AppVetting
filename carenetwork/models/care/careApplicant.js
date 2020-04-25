const mongoose = require('mongoose');

const careApplicantSchema = new mongoose.Schema({
  application: {
    first_name: String,
    middle_name: String,
    last_name: String,
    email: String,
    phone: String,

    dob: Date,

    marital_status: String,

    address: {
      line_1: String,
      line_2: String,
      city: String,
      state: String,
      zip: String,
    },

    contacts: [{
      type: mongoose.ObjectId,
      ref: "careContact",
    }],

    health_issues: String,
    help_request: String,
    home_occupants: String,
    refer_text: String,

    signature: String,
    signature_date: Date,
  },
});

module.exports = mongoose.model('CareApplicant', careApplicantSchema);