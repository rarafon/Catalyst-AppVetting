var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var highlightPackage = require('../models/highlightPackage');
var VettingNotePackage = require('../models/vettingNotePackage');

var WorkItemPackage = require('../models/workItemPackage');

var FinPackage = require('../models/finPackage');

var api = require('../controllers/api');
var User = require('../models/userPackage');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

// Helper query functions

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;
module.exports = function(passport) {
/* Route to specific application by Object ID */
router.get('/:id', isLoggedIn, function(req, res) {
    //Checking what's in params
    console.log("Vetting Worksheet for " + ObjectId(req.params.id));
    /* search by _id. */
    Promise.props({
        doc: DocumentPackage.findOne({_id: ObjectId(req.params.id)}).lean().execAsync(),
        vettingNotes: VettingNotePackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),

        finances: FinPackage.findOne({appID: ObjectId(req.params.id)}).lean().execAsync(),
    		workItems: WorkItemPackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),
    		highlight: highlightPackage.findOne({"documentPackage": ObjectId(req.params.id)}).lean().execAsync(),

	      
	      finances: FinPackage.findOne({appID: ObjectId(req.params.id)}).lean().execAsync()

    })
        .then(function(result) {
            //format birth date for display
            if(result.doc.application.dob.date != null) {
                var dobYear = result.doc.application.dob.date.getFullYear();
                //get month and day with padding since they are 0 indexed
                var dobDay = ( "00" + result.doc.application.dob.date.getDate()).slice(-2);
                var dobMon = ("00" + (result.doc.application.dob.date.getMonth()+1)).slice(-2);

                result.doc.application.dob.date = dobYear + "-" + dobMon + "-" + dobDay;
            }

            // format vetting notes dates
            if(result.vettingNotes.length != 0)
            {
                result.vettingNotes.forEach(function(note, index){
                    var Year = note.date.getFullYear();
                    //get month and day with padding since they are 0 indexed
                    var Day = ( "00" + note.date.getDate()).slice(-2);
                    var Mon = ("00" + (note.date.getMonth()+1)).slice(-2);
                    result.vettingNotes[index].date = Mon + "/" + Day + "/" + Year;
                });
            }


			if(result.workItems.length != 0)
            {
				console.log("there are work items");
                result.workItems.forEach(function(item, index){
					console.log(item.name);
					console.log(item.description);
                    var Year = item.date.getFullYear();
                    //get month and day with padding since they are 0 indexed
                    var Day = ( "00" + item.date.getDate()).slice(-2);
                    var Mon = ("00" + (item.date.getMonth()+1)).slice(-2);
                    result.workItems[index].date = Mon + "/" + Day + "/" + Year;
					console.log(item.date);
                });
            }

			res.locals.layout = 'b3-layout';
			result.user = req.user._id;


            result.title = "Vetting Worksheet";

            res.render('b3-worksheet-view', result);
        })
        .catch(function(err) {
            console.error(err);
        });
});



router.route('/servicearea')
    .post(api.updateService, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not update field");
    }
    else{
        res.json(res.locals);
    }
	});


router.route('/additem')
	.post(api.addWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not add field");
    }
    else{
        res.json(res.locals);
    }
	});

router.route('/deleteitem')
	.post(api.deleteWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not delete field");
    }
    else{
        res.json(res.locals);
    }
	});

router.route('/updateitem')
	.post(api.updateWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not update field");
    }
    else{
        res.json(res.locals);
    }
	});
	
router.route('/finacialForm')
	.post(api.updateFinance, function(req, res) {
		if(res.locals.status != 200) {
			res.status(500).send("could not update field");
		}
		else {
			res.json(res.locals);
		}
	});


return router;
}

//check if user is admin or vetting agent
function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			console.log(req.user._id);
			var userID = req.user._id.toString();

			console.log("userID");
			console.log(userID);
			var ObjectId = require('mongodb').ObjectID;
			//var authenticated = false;
			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				//console.log(user);
				console.log(results);


					if (!results) {
						res.redirect('/user/login');
					}
					else {
						console.log("in first else");
						if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
							return next();

						}
						else {
							console.log("user is not vet");
							res.redirect('/user/login');
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



