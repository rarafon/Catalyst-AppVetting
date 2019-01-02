/**
 * Project Wrap-Up Form Package
 *
 * Once a project is completed, several follow-up steps must be completed.
 * The Wrap-Up Form tracks whether all of that has happened.
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProjectWrapUpPackageSchema = new Schema({
  applicationId: ObjectId,

  signup_sheet_office: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  record_volunteer_info: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  in_kind_donations: {
    // TODO
  },

  porta_pottie_pickup: {
    required: Boolean,
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  waste_dumpster_pickup: {
    required: Boolean,
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  waste_disposal_arrangement: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  return_materials_rentals: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  turn_in_receipts: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  process_reimbursement_checks: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  upload_photos_flickr: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  report_form_submission: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  update_project_webpage: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  client_phone_followup: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  send_thank_you_email: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  determine_followup_required: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  },

  send_closing_letter: {
    complete: Boolean,
    completed_on: Date,
    owner: ObjectId
  }

});

ProjectWrapUpPackageSchema.methods.getCompletedDate = function (name) {
  if (this[name] && this[name].completed_on !== null && this[name].completed_on !== undefined) {
    return this[name].completed_on.toLocaleDateString()
  } else {
    return ''
  }
}

var ProjectWrapUpPackage = mongoose.model('ProjectWrapUpPackage', ProjectWrapUpPackageSchema);

ProjectWrapUpPackage.empty = function (applicationId) {
  return {
    applicationId: applicationId,
    signup_sheet_office: { complete: false, owner: null },
    record_volunteer_info: { complete: false, owner: null },
    porta_pottie_pickup: { complete: false, owner: null },
    waste_dumpster_pickup: { complete: false, owner: null },
    waste_disposal_arrangement: { complete: false, owner: null },
    return_materials_rentals: { complete: false, owner: null },
    turn_in_receipts: { complete: false, owner: null },
    process_reimbursement_checks: { complete: false, owner: null },
    upload_photos_flickr: { complete: false, owner: null },
    report_form_submission: { complete: false, owner: null },
    update_project_webpage: { complete: false, owner: null },
    client_phone_followup: { complete: false, owner: null },
    send_thank_you_email: { complete: false, owner: null },
    determine_followup_required: { complete: false, owner: null },
    send_closing_letter: { complete: false, owner: null }
  }
};


module.exports = ProjectWrapUpPackage;
