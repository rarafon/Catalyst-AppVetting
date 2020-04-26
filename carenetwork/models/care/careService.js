const mongoose = require('mongoose');

const careServiceSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.ObjectId,
    ref: "CareApplicant",
  },
  care_worker: {
    type: mongoose.ObjectId,
    ref: "UserPackage",
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  note: String,
  service_date: Date,
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

module.exports = mongoose.model("CareService", careServiceSchema);