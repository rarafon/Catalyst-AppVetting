/**
 * Project Summary Package
 * 
 * Project summary package for holding form data for the project view 
 * (when project status is "Approved Project").
 * 

 Project Summary View - Show “Approved Projects” 
     Add new entries for “Status” field on application for: 
    • Handle-It - To Be Assigned 
    • Handle-It - Assigned    
    • Handle-It - Completed     
    • Project - Upcoming 
    • Project - In Process 
    • Project - Go Backs 
    • Project - Completed


  Project View (once clicked on it)  
      Should have Client Name and address at the top (as in the mock up)
      The following Tabs:
        * Project Assessment Form 
        * Work Items  
        * Leaders 
        * Planning (using the Planning Form for contents) 
        * Partners (needs new data base fields for Org Name, Org Address, Contact Name, Contact Phone, Contact email) 
        * Wrap Up (using the Wrap Up Form for contents)
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var ProjectSummarySchema = new Schema({


  applicationId: ObjectId,

  status: String,

  projectId: String,

  assocPartners: {type: Array},

  materials: [{
    name: String,
    cost: Number
  }],

  hazard_safety: {
    has_lead: { type: String, default: "unsure" },
    has_asbestos: { type: String, default: "unsure" },
    safety_plan: String
  },

  tool_rentals: [{
    name: String,
    cost: { type: Number, default: 0 }
  }],

  subcontractors: String,

  other_costs: {
    permit: [{
      name: String,
      cost: Number
    }],
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
  
  proposed_dates: [{
    name: String,
    date: Date
  }]
});


module.exports = mongoose.model('ProjectSummaryPackage', ProjectSummarySchema);      //ProjectSummaryPackage
