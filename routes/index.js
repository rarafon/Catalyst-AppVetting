/**
 * This is a simple example of how to use an express router.
 * Renders route: /
 */
var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var api = require('../controllers/api');
var DocumentPackage = require('../models/documentPackage');
var HighlightPackage = require('../models/highlightPackage');
var VettingNotePackage = require('../models/vettingNotePackage');
var api = require('../controllers/api');
var User = require('../models/userPackage');
var config = require('../config');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

// Helper query functions

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;
module.exports = function(passport) {

  /* GET home page. */
  router.get('/', isLoggedIn, function(req, res, next) {
	  
	  var payload = {};
	  payload.title = '';
	  payload.body = '';
	  payload.user_email = res.locals.email;
	  payload.user_role = res.locals.role;
	  payload.user = res.locals.user;
	  payload.user_roles = res.locals.user_roles;
    res.render('index', payload);
  });

  return router
}
//module.exports = router;
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		var userID = req.user._id.toString();

		var ObjectId = require('mongodb').ObjectID;
		Promise.props({
			user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
		})
			     .then(function (results) {
					   if (!results) {
						   //res.redirect('/user/logout');
						   next();
					   }
					   else {
							 
							 //format user data to send to front end
							 res.locals.email = results.user.contact_info.user_email;
							 res.locals.role = results.user.user_role;
							 res.locals.user = results.user._id;
							 res.locals.user_roles = results.user.user_roles;
               res.locals.assign_tasks = results.user.assign_tasks;
							 return next();
						   
					   }



			     })

		       .catch(function(err) {
             console.error(err);
           })
           .catch(next);
		}
		else {
			console.log("no user id");
			next();
		}
}
