function isLoggedIn(req, res, next, targetRole) {

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
                        if(results.user.user_roles.includes(targetRole) || results.user.user_roles.includes("ADMIN")) {
                            res.locals.email = results.user.contact_info.user_email;
                            res.locals.role = results.user.user_role;
                            return next();

                        }

                        else {
                            console.log("user is not required role");
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
            console.log(results);

                if (!results) {
                    //user not found in db.  Route to error handler
                    res.locals.status = 406;
                    return next('route');
                }
                else {
                    if(results.user.user_status == "ACTIVE") {
                        if(results.user.user_role == "PROJECT_MANAGEMENT" || results.user.user_role == "ADMIN") {
                            res.locals.email = results.user.contact_info.user_email;
                            res.locals.role = results.user.user_role;
                            return next();

                        }

                    }
                    else {
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


//post request authenticator.  Checks if user is an admin or vetting or site agent
function isLoggedInPost(req, res, next, targetRole) {
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
                    if(results.user.user_status == "ACTIVE") {
                      res.locals.assign_tasks = results.user.assign_tasks;

                      if( results.user.user_roles.includes(targetRole) || results.user.user_roles.includes('ADMIN')) {
                            res.locals.email = results.user.contact_info.user_email;
                            res.locals.role = results.user.user_role;
                            return next();

                        }

                    }
                    else {
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
