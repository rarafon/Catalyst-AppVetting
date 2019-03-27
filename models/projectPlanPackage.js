/**
 * Project Plan Form Package
 * 
 * Once an assessment has been done, all of the prep work must be completed
 * before day 1 of on-site volunteer work starts. This Project Plan
 * form records everything that has been done towards that.
 * 
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Lead time is in days (before end_date) that the task needs to be done.

var ProjectPlanPackageSchema = new Schema({

  applicationId: ObjectId,

  /* assigned: {
   *   crew_chief: { type: String, default: '' },
   *   project_advocate: { type: String, default: '' },
   *   site_host: { type: String, default: '' }
   * },
   */
  start_date: Date,
  end_date: Date,
  
  contract: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  activated: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  planning_visit: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  rent_porta_pottie: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  rent_waste_dumpster: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  create_page_event_schedule: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  volunteer_request_initial: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  volunteer_request_followup: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  volunteer_request_final: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  report_materials_supplies: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  arrange_purchase_delivery: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  check_weather_forecast: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  verify_volunteer_count: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number
  },

  verify_site_resources: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    ipad: Boolean
  },

  custom: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom1: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom2: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom3: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom4: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom5: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom6: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom7: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  },

  custom8: {
    complete: { type: Boolean, index: true },
    completed_on: Date,
    owner: { type: ObjectId, index: true },
    lead_time: Number,

    note: String
  }
});



ProjectPlanPackageSchema.methods.getCompletedDate = function (name) {
  if (this[name] && this[name].completed_on !== null && this[name].completed_on !== undefined) {
    return this[name].completed_on.toLocaleDateString()
  } else {
    return ''
  }
}

// This filters tasks either unassigned or assigned to a particular userId.
ProjectPlanPackageSchema.statics.filterOwnedTasks = function (userId) {
  console.log("user is " + userId);
  var owner = { $ne: null };
  if (userId) {
    owner = ObjectId(userId)
  }
  return {
    $or: [
      {        
        "contract.owner": { $ne: null },
        "contract.owner": userId,
        "contract.complete": false
      },     
      {        
        "activated.owner": { $ne: null },
        "activated.owner": userId,
        "activated.complete": false
      },      
      {
        "planning_visit.owner": { $ne: null },
        "planning_visit.owner": userId,
        "planning_visit.complete": false
      },     
      {
        "rent_porta_pottie.owner": { $ne: null },
        "rent_porta_pottie.owner": userId,
        "rent_porta_pottie.complete": false
      },      
      {
        "rent_waste_dumpster.owner": { $ne: null },
        "rent_waste_dumpster.owner": userId,
        "rent_waste_dumpster.complete": false
      },      
      {        
        "create_page_event_schedule.owner": { $ne: null },
       "create_page_event_schedule.owner": userId,
        "create_page_event_schedule.complete": false
      },
       {        
         "volunteer_request_initial.owner": { $ne: null },
         "volunteer_request_initial.owner": userId,
         "volunteer_request_initial.complete": false
      },     
      {        
         "volunteer_request_followup.owner": { $ne: null },
        "volunteer_request_followup.owner": userId,
         "volunteer_request_followup.complete": false
      },    
       {        
         "volunteer_request_final.owner": { $ne: null },
         "volunteer_request_final.owner": userId,
        "volunteer_request_final.complete": false
       },    
      {        
         "report_materials_supplies.owner": { $ne: null },
         "report_materials_supplies.owner": userId,
        "report_materials_supplies.complete": false
       },    
       {
        "arrange_purchase_delivery.owner": { $ne: null },
        "arrange_purchase_delivery.owner": userId,
        "arrange_purchase_delivery.complete": false
       },     
      {        
         "check_weather_forecast.owner": { $ne: null },
        "check_weather_forecast.owner": userId,
         "check_weather_forecast.complete": false
       },    
      {        
        "verify_volunteer_count.owner": { $ne: null },
        "verify_volunteer_count.owner": userId,
         "verify_volunteer_count.complete": false
       },      
       {        
        "verify_site_resources.owner": { $ne: null },
        "verify_site_resources.owner": userId,
        "verify_site_resources.complete": false
       },
       {        
        "custom.owner": { $ne: null },
        "custom.owner": userId,
        "custom.complete": false
       },
       {        
        "custom1.owner": { $ne: null },
        "custom1.owner": userId,
        "custom1.complete": false
       },          
       {        
        "custom2.owner": { $ne: null },
        "custom2.owner": userId,
        "custom2.complete": false
       },      
       {        
        "custom3.owner": { $ne: null },
        "custom3.owner": userId,
        "custom3.complete": false
       },      
       {        
        "custom4.owner": { $ne: null },
        "custom4.owner": userId,
        "custom4.complete": false
       },      
       {        
        "custom5.owner": { $ne: null },
        "custom5.owner": userId,
        "custom5.complete": false
       },      
       {        
        "custom6.owner": { $ne: null },
        "custom6.owner": userId,
        "custom6.complete": false
       },      
       {        
        "custom7.owner": { $ne: null },
        "custom7.owner": userId,
        "custom7.complete": false
       },      
       {        
        "custom8.owner": { $ne: null },
        "custom8.owner": userId,
        "custom8.complete": false
       }        
    ]
  }
}

ProjectPlanPackageSchema.statics.filterOpenTasks = function () {
  
  return {
    $or: [
      {        
        
        "contract.complete": false
      },     
      {        
        
        "activated.complete": false
      },      
      {
     
        "planning_visit.complete": false
      },     
      {

        "rent_porta_pottie.complete": false
      },      
      {
        "rent_waste_dumpster.complete": false
      },      
      {        
        "create_page_event_schedule.complete": false
      },
       {        
         "volunteer_request_initial.complete": false
      },     
      {        
         "volunteer_request_followup.complete": false
      },    
       {        
        "volunteer_request_final.complete": false
       },    
      {        
        "report_materials_supplies.complete": false
       },    
       {
        "arrange_purchase_delivery.complete": false
       },     
      {        
         "check_weather_forecast.complete": false
       },    
      {     
         "verify_volunteer_count.complete": false
       },      
       {        
        "verify_site_resources.complete": false
       },
       {        
        "custom.complete": false
       },
       {        
        "custom1.complete": false
       },      
       {        
        "custom2.complete": false
       }, 
       {        
        "custom3.complete": false
       }, 
       {        
        "custom4.complete": false
       }, 
       {        
        "custom5.complete": false
       }, 
       {        
        "custom6.complete": false
       }, 
       {        
        "custom7.complete": false
       }, 
       {        
        "custom8.complete": false
       }   
    ]
  }
}

// Mapping of db names to UI presentation names
var labels = {
  contract: "Contract postal mailed to client",
  activated: "Project activation call to client",
  planning_visit: "Planning visit completed",
  rent_porta_pottie: "Rent porta-pottie",
  rent_waste_dumpster: "Rent waste bin",
  create_page_event_schedule: "Create project webpage, calendar event, and volunteer schedule in Endis",
  volunteer_request_initial: "Send out initial email requesting volunteers. Register into Website/DB.",
  volunteer_request_followup: "Send follow-up emails to volunteers via Endis as needed",
  volunteer_request_final: "Send final email to signed up volunteers 3-5 days before project",
  report_materials_supplies: "Create list of materials, rentals &amp; supplies needed. Send to Darrell.",
  arrange_purchase_delivery: "Arrange for purchase &amp; delivery of all materials, rentals, supplies, etc.",
  check_weather_forecast: "Check the weather forecast and make plans accordingly",
  verify_volunteer_count: "Verify number of volunteers signed up",
  verify_site_resources: "Verify site resources needed",
  custom: "Custom Task",
  custom1: "Custom Task",
  custom2: "Custom Task",
  custom3: "Custom Task",
  custom4: "Custom Task",
  custom5: "Custom Task",
  custom6: "Custom Task",
  custom7: "Custom Task",
  custom8: "Custom Task"

};

ProjectPlanPackageSchema.statics.labels = labels;

// This returns an object with only the tasks relevant to a particular user.
ProjectPlanPackageSchema.statics.getOnlyAssigned = function (plan, userId) {
  var taskNames = Object.keys(labels);
  var assigned = [];

  for (var i = 0; i < taskNames.length; i++) {
    var name = taskNames[i]

    // if (plan[name].note) {
    //     plan[name].note.toString()
    // }

    if (plan[name].owner
        && plan[name].owner.toString() === userId.toString()
        // && plan[name].complete === false
    ) {

      if (plan[name].complete === false) {
        // if (plan[name].note && plan[name].note != '') {
        //     assigned.push(Object.assign({}, plan[name], { label: plan[name].note }));
        // } else {
        //     assigned.push(Object.assign({}, plan[name], { label: labels[name] }));
        // }
        if (plan[name].note && plan[name].note !== "Empty") {
                assigned.push(Object.assign({}, plan[name], { label: plan[name].note }, {labelKey: name}));
        } else {
            if (labels[name] !== "Custom Task") {
                assigned.push(Object.assign({}, plan[name], { label: labels[name] }, {labelKey: name}));
            }
        }
      }
    }
  }

  return assigned;
}

ProjectPlanPackageSchema.statics.getTopXOpen = function (plan, taskCount) {
  var taskNames = Object.keys(labels);
  var open = [];
var count = 0;
  for (var i = 0; i < taskNames.length; i++) {
    var name = taskNames[i]
    

      if (plan[name].complete === false) {
        if (plan[name].note && plan[name].note !== "Empty") {
                open.push(Object.assign({}, plan[name], { label: plan[name].note }, {labelKey: name}));
        } else {
            if (labels[name] !== "Custom Task") {
                open.push(Object.assign({}, plan[name], { label: labels[name] }, {labelKey: name}));
            }
        }
        count++;
        if(count === taskCount)
        {
          break;
        }
      }
    
  }

  return open.sort(function(a,b) {
    console.log(a.lead_time);
    console.log(b.lead_time);
    a = new Date(a.lead_time);
    b = new Date(b.lead_time);
    return a > b ?-1 : a<b ? 1:0;
  });
}



var ProjectPlanPackage = mongoose.model('ProjectPlanPackage', ProjectPlanPackageSchema);

ProjectPlanPackage.empty = function(applicationId) {
  return {
    applicationId: applicationId,

    start_date: null,
    end_date: null,

    contract: { complete: false, owner: null, completed_on: null, lead_time: null },
    activated: { complete: false, owner: null, completed_on: null, lead_time: null },
    planning_visit: { complete: false, owner: null, completed_on: null, lead_time: null },
    rent_porta_pottie: { complete: false, owner: null, completed_on: null, lead_time: null },
    rent_waste_dumpster: { complete: false, owner: null, completed_on: null, lead_time: null },
    create_page_event_schedule: { complete: false, owner: null, completed_on: null, lead_time: null },
    volunteer_request_initial: { complete: false, owner: null, completed_on: null, lead_time: null },
    volunteer_request_followup: { complete: false, owner: null, completed_on: null, lead_time: null },
    volunteer_request_final: { complete: false, owner: null, completed_on: null, lead_time: null },
    report_materials_supplies: { complete: false, owner: null, completed_on: null, lead_time: null },
    arrange_purchase_delivery: { complete: false, owner: null, completed_on: null, lead_time: null },
    check_weather_forecast: { complete: false, owner: null, completed_on: null, lead_time: null },
    verify_volunteer_count: { complete: false, owner: null, completed_on: null, lead_time: null },
    verify_site_resources: { complete: false, owner: null, completed_on: null, lead_time: null, ipad: false },
    custom: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom1: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom2: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom3: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom4: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom5: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom6: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom7: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
    custom8: { complete: false, owner: null, completed_on: null, lead_time: null, note: null },
  }
};

module.exports = ProjectPlanPackage;
