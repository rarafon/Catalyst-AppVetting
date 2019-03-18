// So for every model that you work on you create a model.js document, and
// add it in the models/connection.js

// Models
Application = require('./application');
Residence = require('./residence');
DocumentPackage = require('./documentPackage');
PartnerPackage = require('./partnerPackage');

// Export it so we can use it
exports.applicationModel = Application.applicationModel;
exports.residenceModel = Residence.residenceModel;
exports.documentPackageModel = DocumentPackage.documentPackageModel;
exports.partnerPackageModel = PartnerPackage.partnerPackageModel;