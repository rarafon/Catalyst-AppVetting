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


var PlanningPackageSchema = new Schema({

  applicationId: ObjectId,

  leadership_assigned: Boolean,
  date_scheduled: Boolean,
  contract_emailed: Boolean,
  client_called: Boolean,
  planning_visit: Boolean,
  porta_john: Boolean,
  waste_bin: Boolean,
  project_page: Boolean,
  volunteer_request: Boolean,
  volunteer_email: Boolean,



});


var PlanningPackage = mongoose.model('PlanningPackage', PlanningPackageSchema);

PlanningPackage.empty = {
  
}

module.exports = PlanningPackage;
