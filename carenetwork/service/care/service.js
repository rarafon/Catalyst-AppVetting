var CareService = require('../../models/care/careService');

function get_services(applicant_id) {
  var query = CareService.find({applicant: applicant_id}).lean();
  query = query.exec();
}

function create_service(applicant, data) {
}

module.exports.get_services = get_services;
module.exports.create_service = create_service;