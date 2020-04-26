var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');

var User = require('../models/userPackage');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport){
    router.get('/', isLoggedIn, function(req, res){
        res.render('projectsumreport');
    })
    return router
};

function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()) {
        var userID = req.user._id.toString();
        var ObjectId = require('mongodb').ObjectID;
        Promise.props({
            user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
        })
        .then(function (results) {
                if (!results) {
                    res.redirect('/user/logout');
                }
                else {
                    if(results.user.user_status == "ACTIVE") {
          res.locals.assign_tasks = results.user.assign_tasks;
          
                        if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
                            res.locals.email = results.user.contact_info.user_email;
                            res.locals.role = results.user.user_role;
                            res.locals.user_roles = results.user.user_roles;
                            return next();

                        }
                        else if(results.user.user_roles !== undefined  && results.user.user_roles.indexOf('PROJECT_MANAGEMENT') > -1) {
                            res.locals.email = results.user.contact_info.user_email;
                            res.locals.role = results.user.user_role;
                            res.locals.user_roles = results.user.user_roles;
                            return next();

                        }

                        else {
                            
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