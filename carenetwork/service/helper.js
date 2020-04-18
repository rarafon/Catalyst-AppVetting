/***
 * Helper Functions for Care Network
 */

var express = require('express');
// var db = require('../mongoose/connection');
var User = require('../../models/userPackage');


// Uses Promises to retrieve user info. Returns context object
function create_user_context(req) {
  var userID = req.user._id.toString();

  var myPromise = new Promise((resolve, reject) => {
      var result = User.findOne({"_id": userID}).lean();
      resolve(result);
    });

  return myPromise.then( (result) => {
    return {
      // user_role: result.user.user_role,
      user_email: result.contact_info.user_email,
      user: true,
      carenetwork: true
    }
  });
}

//check to see if user is logged in and a vetting agent or site or an admin
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  else {
    console.log("no user id");
    res.redirect('/user/login');
  }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.create_user_context = create_user_context;