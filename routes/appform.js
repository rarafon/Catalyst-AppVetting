//This file routes our application and handles post routes to the API
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
  router.route('/add') 
	
        .get(isLoggedIn, function(req, res) {
		      
		      var payload = {};
		      
		      payload.user_email = res.locals.email;
		      payload.user_role = res.locals.role;
		      res.locals.layout = 'applicationlayout';        // Changes default from layout.hbs to b3-layout.hbs
          res.render('applicationform', payload);
        })
        .post(api.postDocument, function(req, res) {
          res.json(res.locals);
        })

  router.get('/success', function(req, res) {
    //render the success page
    res.render('applicationsuccess');
  });

  /* GET ALL DOCUMENTS AND PRINT TO CONSOLE */
  /* BONUS HANDLEBARS TEMPLATE EXAMPLE */
  router.get('/show', function(req, res) {
    // Static list is passed and referenced in rest-list.hbs
    var staticList = { restname: ['mcdonald', 'burger king', 'subway'] };

    // Load in the application model
    var query = Application.find({}, function(err, docs) {
      if (err) throw err;
      console.log(docs);
      return docs;
    });

    res.render('rest-list', staticList);
  });

  /* GET ALL DOCUMENTS AND RETURN A JSON FILE */
  router.get('/show-all', function(req, res) {
    Application.find(function(err, docs) {
      if (err)
        res.send(err);
      res.json(docs);
    });
  });

  /* USING HELP QUERY FROM /mongoose/query-helpers.js */
  /* THIS EXAMPLE SEARCHES BY LAST NAME */
  /* Last names in DB: fitzpatrick, washington, west */
  router.get('/helper-last-name', function(req, res) {
    Application.findLastName("West", function(err, docs) {
      if (err) console.error(err);
      console.log(docs);
      res.json(docs);
    })
  });

  /* INSERT */
  router.post('/insert_user', function(req, res) {
    // get the db instance
    var db = req.db;

    // get POST values from html page
    var building = req.body.a_building;
    var coord1 = req.body.a_coord_1;
    var coord2 = req.body.a_coord_2;
    var street = req.body.a_street;
    var zip = req.body.a_zip;
    var borough = req.body.borough;
    var cuisine = req.body.cuisine;
    var name = req.body.name;
    var restid = req.body.restaurant_id;

    console.log('POST VALUES: ' + '\n' + building + '\n' + coord1 + '\n' + coord2
              + '\n' + street + '\n' + zip + '\n' + borough + '\n' + cuisine + '\n' +
                name  + '\n' + restid + '\n');

    res.send("Insert a new rest (C)");
  });
  return router;
  //module.exports = router;
}


//check to see if user is logged in
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
