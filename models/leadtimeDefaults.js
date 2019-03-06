var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId


var LeadtimeDefaultsSchema = new Schema(
  {
    contract: { type: Number, 'default': 20 },
    activated: { type: Number, 'default': 20 },
    planning_visit: { type: Number, 'default': 20 },
    rent_porta_pottie: { type: Number, 'default': 20 },
    rent_waste_dumpster: { type: Number, 'default': 20 },
    create_page_event_schedule: { type: Number, 'default': 20 },
    volunteer_request_initial: { type: Number, 'default': 20 },
    volunteer_request_followup: { type: Number, 'default': 20 },
    volunteer_request_final: { type: Number, 'default': 20 },
    report_materials_supplies: { type: Number, 'default': 20 },
    arrange_purchase_delivery: { type: Number, 'default': 20 },
    check_weather_forecast: { type: Number, 'default': 20 },
    verify_volunteer_count: { type: Number, 'default': 20 },
    verify_site_resources: { type: Number, 'default': 20 }
  },
  {
    capped: {
      max: 1,
      size: 4096
    }
  }
);


LeadtimeDefaultsSchema.statics.upsert = function (u, cb) {
  var updates = {}
  if (typeof u === 'object') {
    updates = u
  }
  this.findOneAndUpdate(
    null,
    u,
    {
      'new': true,
      update: true,
      setDefaultsOnInsert: true
    },
    cb
  );
}


module.exports = mongoose.model('LeadtimeDefaults', LeadtimeDefaultsSchema);
