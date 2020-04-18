var express = require('express');

//check to see if user is logged in and a vetting agent or site or an admin
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
  //   console.log(req.user._id);
  //   var userID = req.user._id.toString();

  //   var ObjectId = require('mongodb').ObjectID;
  //   Promise.props({
  //     user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
  //   })
  //   .then(function (results) {
  //     console.log(results);

  //       if (!results) {
  //         res.redirect('/user/logout');
  //       }
  //       else {
  //         if(results.user.user_status == "ACTIVE") {
  //           res.locals.assign_tasks = results.user.assign_tasks;
            
  //           if(results.user.user_role == "VET" || results.user.user_role == "ADMIN" || results.user.user_role == "SITE") {
  //             res.locals.email = results.user.contact_info.user_email;
  //             res.locals.role = results.user.user_role;
  //             res.locals.user_roles = results.user.user_roles;
  //             return next();

  //           }
  //           else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('SITE') >-1)
  //         {
  //           res.locals.email = results.user.contact_info.user_email;								
  //           res.locals.role = results.user.user_role;
  //           res.locals.user_roles = results.user.user_roles;
  //           return next();
  //         }

  //           else {
  //             console.log("user is not required role");
  //             res.redirect('/user/logout');
  //           }
  //         }
  //         else {
  //           //user not active
  //           console.log("user not active");
  //           res.redirect('/user/logout');
  //         }
  //       }



  //   })

  // .catch(function(err) {
  //             console.error(err);
  //     })
  //      .catch(next);
    return next();
  }
  else {
    console.log("no user id");
    res.redirect('/user/login');
  }
}

//post request authenticator.  Checks if user is an admin or vetting or site agent
function isLoggedInPost(req, res, next) {
  if(req.isAuthenticated()) {
    console.log(req.user._id);
    var userID = req.user._id.toString();

    var ObjectId = require('mongodb').ObjectID;

    Promise.props({
      user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
    })
    .then(function (results) {
      console.log('123');
      console.log(results);

        if (!results) {
          //user not found in db.  Route to error handler
          res.locals.status = 406;
          return next('route');
        }
        else {
          if(results.user.user_status == "ACTIVE") {							
            if(results.user.user_role == "VET" || results.user.user_role == "ADMIN" || results.user.user_role == "SITE" || results.user.user_role=="PROJECT_MANAGEMENT") {
              res.locals.email = results.user.contact_info.user_email;
              res.locals.role = results.user.user_role;
              if (results.user.user_roles) {
                res.locals.user_roles = results.user.user_roles;
              }
              return next();

            }
            else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('SITE') >-1)
            {
              res.locals.role = results.user.user_role;
              res.locals.user_roles = results.user.user_roles;
              return next();
            }

          }
          else {
            console.log('234');
            //user is not active
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

module.exports.isLoggedIn = isLoggedIn;