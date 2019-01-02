var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RolePackageSchema = new Schema({
	role_name: String,
	role_display: String
	
});

var RolePackage = mongoose.model('RolePackage', RolePackageSchema);
module.exports = RolePackage;