var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var UserPackage = require('../models/userPackage');
var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose to use bluebird
Promise.promisifyAll(mongoose); // Convert all of mongoose to promises with bluebird

module.exports = {
	postInitialUser: function(req, res) {
        // Data will be submitted using req.body
        console.log('[ API ] postInitialUser :: Call invoked');
		console.log(req.body);
        //create new mongoose object
        var doc = new UserPackage(req.body);
		doc.setPassword(req.body.password);

        // Save the user package to the database with a callback to handle flow control
        doc.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else if (numAffected == 1) {
                console.log('[ API ] postInitialUser :: User Created with ID: ' + doc._id);
				res.send( { status : 200 } );
            }
        });
    }
};
