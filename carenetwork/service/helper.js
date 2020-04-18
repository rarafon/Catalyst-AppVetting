var express = require('express');

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