/*
Financial document package - includes requested/received boxes from vetting worksheet
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var FinPackageSchema = new Schema({
	appID: { type: ObjectId},
	name : String,

	food_stamps : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	income_tax : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	employment : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	ss_ben : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	pension : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	house_assist : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	check_account : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	saving_account : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	ret_fund : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	invest : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	physical : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	other_resources : {
		desc : String,
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	},

	proof_own : {
		req : Boolean,
		rec : Boolean,
		na  : Boolean,
		note : String
	}

});


var FinPackage = mongoose.model('FinPackage', FinPackageSchema);
module.exports = FinPackage;
