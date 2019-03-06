/**
 * Assessment Form Package
 * 
 * Assessments of the future work site must happen before any work is done, plus
 * other arrangements need to be made for the days and times of work (Porta-johns,
 * tool rentals, etc.). 
 * 
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var AssessmentPackageSchema = new Schema({

  applicationId: ObjectId,

  materials: String,

  hazard_safety: {
    has_lead: { type: String, default: "unsure" },
    has_asbestos: { type: String, default: "unsure" },
    safety_plan: String
  },

  tool_rentals: String,

  subcontractors: String,

  other_costs: {
    permit: {
      name: String,
      cost: { type: Number, default: 0 },
    },
    porta_pottie: {
      required: Boolean,
      cost: { type: Number, default: 0 },
    },
    waste_dumpster: {
      required: Boolean,
      cost: { type: Number, default: 0 },
    }    
  },

  estimates: {
    total_cost: Number,
    volunteers_needed: Number
  },
  
  proposed_dates: {
    start_date: Date,
    end_date: Date
  }
});


var AssessmentPackage = mongoose.model('AssessmentPackage', AssessmentPackageSchema);

AssessmentPackage.empty = {
  hazard_safety: {
    has_lead: null, has_asbestos: null
  },
  other_costs: {
    permit: { cost: 0 },
    porta_pottie: { required: false, cost: 0 },
    waste_dumpster: { required: false, cost: 0 }
  },
  estimates: { total_cost: 0, volunteers_needed: 0 },
  proposed_dates: {
    start_date: '',
    end_date: ''
  }
}

module.exports = AssessmentPackage;
