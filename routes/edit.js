var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DocumentPackage = require('../models/documentPackage');
var api = require('../controllers/api');
var User = require('../models/userPackage');
var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;

/**
 * This router handles all edits made to application fields and vetting notes
 * It only handles POST request and no GET requests
 */
module.exports = function(passport) {
  //the default route, which will never be used
  //TODO: Report 404 instead by ultimately not including this and creating a 404 page
  router.post('/', function(req, res) {
    console.log("POST to page without ID parameter");
  });

  /**
     editing highlight features
     Requires the highlightPackage ID
   **/
  router.post('/highlight/:id', isLoggedInPost, api.toggleHighlight, function(req, res) {

    if(res.locals.status != '200'){
      res.status(500).send("Could not update field");
    }
    else{
      res.status(200).send({ status: '200' });
    }

  })

  /**
   * POST Updated Field data
   * Only handles single line updates (e.g., phone number, Date of birth)
   **/
  router.post('/:id', isLoggedInPost, api.putUpdateDocument, function(req, res) {

    if(res.locals.status != '200'){
      res.status(500).send("Could not update field");
    }
    else{
      res.status(200).send({ status: 'success' });
    }

  });

  /**
   * POST Updated Field data
   * Only handles single line updates (e.g., phone number, Date of birth)
   **/
  router.post('/project/:id', isLoggedInProjectRole, api.putUpdateProject, function(req, res) {

    if(res.locals.status != '200'){
      res.status(500).send("Could not update field");
    }
    else{
      res.status(200).send({ status: 'success' });
    }

  });

 /**
   * POST Updated Field data
   * Only handles single line updates (e.g., phone number, Date of birth)
   **/
  router.post('/putUpdatePartner/:id', isLoggedInProjectRole, api.putUpdatePartner, function(req, res) {
    console.log("Triggered Partner Edit");

    if(res.locals.status != '200'){
      res.status(500).send("Could not update field");
    }
    else{
      res.status(200).send({ status: 'success' });
    }

  });

  /**
   * Handles Updates of elements in arrays
   * It requires special handling in the API
   */
  router.post('/array/:id', isLoggedInPost, api.putUpdateArray, function(req, res) {

    if(res.locals.status != '200'){
      res.status(500).send("Could not update field");
    }
    else{
      res.status(200).send({ status: 'success' });
    }

  });

  /**
   * The Following routes don't conform to the api.putUpdateDocument function to update a field since they contain several fields
   */

  /**
   * EDITING ADDRESS
   **/
  router.post('/address/:id', isLoggedInPost, function(req, res) {

    console.log("Updating: ");
    console.log("Line 1: " + req.body["value[line_1]"]);
    console.log("Line 2: " + req.body["value[line_2]"]);
    console.log("City: " + req.body["value[city]"]);
    console.log("State: " + req.body["value[state]"]);
    console.log("Zip: " + req.body["value[zip]"]);

    DocumentPackage.update(
      {_id: ObjectId(req.params.id)},
      { $set:
        {
          "application.address.line_1": req.body["value[line_1]"],
          "application.address.line_2": req.body["value[line_2]"],
          "application.address.city": req.body["value[city]"],
          "application.address.state": req.body["value[state]"],
          "application.address.zip": req.body["value[zip]"],
          "updated": Date.now()
        }
      },
      function(err)
      {
        if(err)
          {   res.status(500).send({ status: 'Could not update address' });}
        else
          {   res.status(200).send({ status: 'success' });}
      }
    );
  });

  /**
   * EDITING FULL NAME
   **/
  router.post('/name/:id', isLoggedInPost, function(req, res) {
    //Checking what's in params
    console.log("Updating: ");
    console.log("First Name: " + req.body["value[first]"]);
    console.log("Middle Name: " + req.body["value[middle]"]);
    console.log("Last Name: " + req.body["value[last]"]);

    DocumentPackage.update(
      {_id: ObjectId(req.params.id)},
      { $set:
        {
          "application.name.first": req.body["value[first]"],
          "application.name.middle": req.body["value[middle]"],
          "application.name.last": req.body["value[last]"],
          "updated": Date.now()
        }
      },
      function(err)
      {
        if(err)
          {   res.status(500).send({ status: 'error' });}
        else
          {   res.status(200).send({ status: 'success' });}
      }
    );
  });
  //module.exports = router;
  return router;
}

//check to see if user is logged in and a vetting agent or an admin
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		console.log(req.user._id);
		var userID = req.user._id.toString();
		
		console.log("userID");
		console.log(userID);
		var ObjectId = require('mongodb').ObjectID;
		Promise.props({
			user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
		})
			     .then(function (results) {
				     console.log(results);
					   
					   if (!results) {
						   res.redirect('/user/logout');
					   }
					   else {
						   if(results.user.user_status == "ACTIVE") {
                 res.locals.assign_tasks = results.user.assign_tasks;
							   
                 if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
								   return next();

                 }
                 else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('VET') >-1)
							     {
								     res.locals.role = results.user.user_role;
								     res.locals.user_roles = results.user.user_roles;
								     return next();
							     }
							   
							   else {
								   console.log("user is not vet");
								   res.redirect('/user/logout');
							   }
						   }
						   else {
							   //user not active
							   console.log("user not active");
							   res.redirect('/user/logout');
						   }
					   }
             
				     
				     
			     })
    
		       .catch(function(err) {
             console.error(err);
           })
           .catch(next);
	}
	else {
		console.log("no user id");
		res.redirect('/user/login');
	}
}

//post request authenticator.  Checks if user is an admin or vetting agent
function isLoggedInPost(req, res, next) {
	if(req.isAuthenticated()) {
		console.log(req.user._id);
		var userID = req.user._id.toString();
		
		var ObjectId = require('mongodb').ObjectID;
		
		Promise.props({
			user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
		})
			     .then(function (results) {
				     console.log(results);
				     
					   if (!results) {
						   //user not found in db.  Route to error handler
						   res.locals.status = 406;
						   return next('route');
					   }
					   else {
						   
						   if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
							   return next();

               }
               else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('VET') >-1)
                 {
                   
                   return next();
                 }
						   else {
							   //user is not a vetting agent or admin, route to error handler
							   res.locals.status = 406;
							   return next('route');
						   }
					   }
             
				     
				     
			     })
    
		       .catch(function(err) {
             console.error(err);
           })
           .catch(next);
	}
	else {
		//user is not logged in
		console.log("no user id");
			res.locals.status = 406;
			return next('route');
		}
}

//post request authenticator.  Checks if user is an admin or vetting agent
function isLoggedInProjectRole(req, res, next) {
  if(req.isAuthenticated()) {
    console.log(req.user._id);
    var userID = req.user._id.toString();
    
    var ObjectId = require('mongodb').ObjectID;
    
    Promise.props({
      user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
    })
           .then(function (results) {
             console.log(results);
             
             if (!results) {
               //user not found in db.  Route to error handler
               res.locals.status = 406;
               return next('route');
             }
             else {
               
               if(results.user.user_role == "PROJECT_MANAGEMENT" || results.user.user_role == "ADMIN") {
                 return next();

               }
               else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('PROJECT_MANAGEMENT') >-1)
                 {
                   
                   return next();
                 }
               else {
                 //user is not a vetting agent or admin, route to error handler
                 res.locals.status = 406;
                 return next('route');
               }
             }
             
             
             
           })
    
           .catch(function(err) {
             console.error(err);
           })
           .catch(next);
  }
  else {
    //user is not logged in
    console.log("no user id");
      res.locals.status = 406;
      return next('route');
    }
}
