var CareService = require('../../models/care/careService');
var UserPackage = require('../../../models/userPackage')

async function get_services(applicant_id) {
  var result = await CareService.find({applicant: applicant_id}).lean().exec();
  return result;
}

async function get_service(service_id) {
  var result = await CareService.find({_id: service_id}).lean().exec();
  return result[0];
}

async function create_service(applicant_id, data) {
  var service = new CareService();
  service.applicant = applicant_id;
  service.care_worker = data.care_worker;
  service.service_date = data.service_date;
  service.note = data.note;
  await service.save();
  return true;
}

async function get_workers() {
  var workers = await UserPackage.find({}).lean().exec();

  var data = workers.map(function(service_object) {
    var obj = {};
    obj.id = service_object._id;
    obj._id = service_object._id;
    obj.email = service_object.contact_info.user_email;
    obj.name = service_object.contact_info.user_name.user_first;
    if (service_object.contact_info.user_name.user_middle) {
      obj.name += " " + service_object.contact_info.user_name.user_middle;
    }
    obj.name += " " + service_object.contact_info.user_name.user_last;

    return obj;
  });
  
  return data;
}

module.exports.get_services = get_services;
module.exports.create_service = create_service;
module.exports.get_workers = get_workers;
module.exports.get_service = get_service;