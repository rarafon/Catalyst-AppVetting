/**
 * Most important note on this page. Currently this API function as middleware for an Express router.
 * Currently all functions are MIDDLEWARE in the Express app
 *      Middleware Docs:  https://expressjs.com/en/guide/using-middleware.html
 *      Inspiration:      https://medium.com/@jeffandersen/building-a-node-js-rest-api-with-express-46b0901f29b6#.6ttj8e6rs
 *                        https://medium.com/@jeffandersen/building-a-node-js-rest-api-with-express-part-two-9152661bf47#.4ofcnx1fv
 *
 * A more normal express function might look like this:
 *      router.get('/index', function(req, res) { ...do the magic }
 *
 * To use this API as middleware simply tacj the function between the route ('/index') and the function().
 *      router.get('/status', api.getDocumentByStatus, function(req, res) { ...do the magic }
 *
 * In this example getDocumentByStatus returns a JSON object
 *
 * They keep req, res, err, and next intact as they are passed around the route
 * It is best practice to store new variable in res.local.<your variable>
 */

/**
 * Import node modules and node exports
 * mongoose             - schemas, templates, queries
 * db                   - connection to the database server
 * DocumentPackage      - schema and model for DocumentPackage CRUD
 * HighlightPackage     - schema and model for HighlightPackage CRUD
 * VettingNotePackage   - schema and model for VettingNotePackage CRUD
 * bluebird             - converts mongoose API calls to ES6 promises
 *
 * Import any other required modules
 */

var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var HighlightPackage = require('../models/highlightPackage');
var ProjectNotePackage = require('../models/projectNotePackage.js');
var VettingNotePackage = require('../models/vettingNotePackage');
var AssessmentPackage = require('../models/assessmentPackage.js');
var PlanningPackage = require('../models/planningPackage.js');
var ProjectPlanPackage = require('../models/projectPlanPackage.js');
var WorkItemPackage = require('../models/workItemPackage');
var UserPackage = require('../models/userPackage');
var RolePackage = require('../models/rolePackage');
var ProjectWrapUpPackage = require('../models/projectWrapUpPackage.js');
var ProjectSummaryPackage = require('../models/projectSummaryPackage.js');
var PartnerPackage = require('../models/partnerPackage.js');
var LeadtimeDefaults = require('../models/leadtimeDefaults.js');

var FinancialPackage = require('../models/finPackage');
var crypto = require('crypto');
var bluebird = require('bluebird');
var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose to use bluebird
Promise.promisifyAll(mongoose); // Convert all of mongoose to promises with bluebird
var ObjectId = require('mongodb').ObjectId;
module.exports = {
    /**
     * Description: retrieve all Document Packages from the database
     * Type: GET
     * Params: none
     * Address: api.getAllDocuments
     * Returns: results[array of Document Packages]
     */
    getAllDocuments: function (req, res, next) {
        // Create an object to be filled with promises. The object will look like:
        // .then(function (<name of object here>) {...})
        // If the name is results, use results.DocumentPackage[index].<what you need>
        // Obviously it will be an array of DocumentPackages in this example
        Promise.props({
            application: DocumentPackage.find().lean().execAsync(),
            count: DocumentPackage.find().count().execAsync()
        })
            .then(function (results) {
                // Save the results into res.locals
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    /**
     * Description: retrieve a DocumentPackage from the database by _id
     * Type: GET
     * Params: _id of Document Package
     * Address: api.getDocumentById
     * Returns: results object (mimics documentPackage.js)
     */
    getDocumentById: function (req, res, next) {
        // Use results.DocumentPackage.<whatever you need> to access the information
        Promise.props({
            document: DocumentPackage.findById(req.params.id).lean().execAsync()
			/*document: DocumentPackage.aggregate(
				[
				{$match: { _id : mongoose.Types.ObjectId(req.params.id)}},
					{ $redact: {
						$cond: {
							if: { $eq: [ "$level", 5 ] },
							then: "$$PRUNE",
							else: "$$DESCEND"
						}
					}}
					
				]
			).execAsync()*/
			
        })
            .then(function(results) {

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

	//site assessment get docs for view
	getDocumentStatusSite: function (req, res, next) {		
        // Use results.DocumentPackage.<whatever you need> to access the information
        Promise.props({
            //document: DocumentPackage.findById(req.params.id).lean().execAsync()
			site: DocumentPackage.aggregate(
				[
				{$match: { status: "assess"}},
					{ $redact: {
						$cond: {
							if: { $eq: [ "$level", 5 ] },
							then: "$$PRUNE",
							else: "$$DESCEND"
						}
					}}
					
				]
			).execAsync(),
			
			complete: DocumentPackage.aggregate(
				[
				{$match: { status: "assessComp" }},
					{ $redact: {
						$cond: {
							if: { $eq: [ "$level", 5 ] },
							then: "$$PRUNE",
							else: "$$DESCEND"
						}
					}}
					
				]
			).execAsync()
        })
            .then(function(results) {
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

	
	
	//site assessment get docs for view
	getDocumentSite: function (req, res, next) {
    res.locals.docId = req.params.id;
		// Use results.DocumentPackage.<whatever you need> to access the information
    Promise.props({
      //document: DocumentPackage.findById(req.params.id).lean().execAsync()
			doc: DocumentPackage.aggregate([
				{$match: { _id : mongoose.Types.ObjectId(req.params.id)}},
				{ $redact: {
					$cond: {
						if: { $eq: [ "$level", 5 ] },
						then: "$$PRUNE",
						else: "$$DESCEND"
					}
				}}
			]).execAsync(),
			work: WorkItemPackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),
      assessment: AssessmentPackage.find({ applicationId: ObjectId(req.params.id) }).lean().execAsync(),
      projectNotes: ProjectNotePackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),
    }).then(function(results) {
        res.locals.results = results;
      next();

    }).catch(function(err) {
      console.error(err);
    }).catch(next);
  },
//site assessment get docs for view
getDocumentPlanning: function (req, res, next) {
		// Use results.DocumentPackage.<whatever you need> to access the information
    Promise.props({
      //document: DocumentPackage.findById(req.params.id).lean().execAsync()
			doc: DocumentPackage.aggregate([
				{$match: { _id : mongoose.Types.ObjectId(req.params.id)}},
				{ $redact: {
					$cond: {
						if: { $eq: [ "$level", 5 ] },
						then: "$$PRUNE",
						else: "$$DESCEND"
					}
				}}
			]).execAsync(),
			work: WorkItemPackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),
      planning: PlanningPackage.find({ applicationId: ObjectId(req.params.id) }).lean().execAsync()

    }).then(function(results) {
        res.locals.results = results;
      next();

    }).catch(function(err) {
      console.error(err);
    }).catch(next);
  },
	getUsers: function(req, res, next) {
		 Promise.props({
            users: UserPackage.find().lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    console.log('No users found');
                }
                else {
					for(var x=0; x<results.users.length; x++) {
						results.users[x].salt = "";
                        results.users[x].hash = "";
                        results.users[x].user_roles_display="";
                        if (results.users[x].user_roles === undefined || results.users[x].user_roles.length===0 ) {
                            results.users[x].user_roles_display += results.users[x].user_role + " | ";
                        }
                        else {
                            for (var i = 0; i < results.users[x].user_roles.length; i++) {
                                results.users[x].user_roles_display += results.users[x].user_roles[i] + " | ";
                            }
                        }
					}
				}

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },
	
	getUserRoles: function(req, res, next) {
		 Promise.props({
            roles: RolePackage.find().lean().execAsync()
        })
            .then(function(results) {
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

	findUser: function (req, res, next) {
		//req.body.id = ObjectId("588d02d4cc6b36283886be18");
        // Use results.DocumentPackage.<whatever you need> to access the information
        Promise.props({
            user: UserPackage.findById(req.params.id).lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    console.log('[ API ] findUser :: user package found: FALSE');
                }
                else {
					results.user.hash = "";
					results.user.salt = "";
					if(results.user.contact_info.user_dob.dob_date != null) {
						var dobYear = results.user.contact_info.user_dob.dob_date.getFullYear();
						//get month and day with padding since they are 0 indexed
						var dobDay = ( "00" + results.user.contact_info.user_dob.dob_date.getDate()).slice(-2);
						var dobMon = ("00" + (results.user.contact_info.user_dob.dob_date.getMonth()+1)).slice(-2);
						results.user.contact_info.user_dob.dob_date = dobYear + "-" + dobMon + "-" + dobDay;
					}
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },


    /**
     * Description: retrieve all Document Packages from the database and group by status code
     * Type: GET
     * Params: none
     * Address: api.getDocumentByStatus
     * Returns: results.statuscode[array of Document Packages]
     * Notes: statuscode is defined as any property of Promise.props (ex: new, phone, assess)
     */
    getDocumentByStatus: function(req, res, next) {
		var currentTime = new Date();
		var year = currentTime.getFullYear();
        // Access the returned items as results.<status code>[array index].<what you need>
        // Example: results.visit[3].address.line_1 = a string
        Promise.props({
            new: DocumentPackage.find({status: "new"}).sort({'updated':-1}).lean().execAsync(),
            phone: DocumentPackage.find({status: "phone"}).lean().execAsync(),
            documents: DocumentPackage.find({status: "documents"}).lean().execAsync(),
            discuss: DocumentPackage.find({status: "discuss"}).lean().execAsync(),
            assess: DocumentPackage.find({status: "assess"}).lean().execAsync(),
			assessComp: DocumentPackage.find({status: "assessComp"}).lean().execAsync(),
            withdrawn: DocumentPackage.find({status: "withdrawn"}).lean().execAsync(),
            withdrawnooa: DocumentPackage.find({ status: "withdrawnooa" }).lean().execAsync(),
            approval: DocumentPackage.find({status: "approval"}).lean().execAsync(),
            handle: DocumentPackage.find({status: "handle"}).lean().execAsync(),
            // declined: DocumentPackage.find({status: "declined", app_year : year}).lean().execAsync(),
            // project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync(),
            // handleToBeAssigned: DocumentPackage.find({status: "handleToBeAssigned", app_year : year}).lean().execAsync(),
            // handleAssigned: DocumentPackage.find({status: "handleAssigned", app_year : year}).lean().execAsync(),
            // handleCompleted: DocumentPackage.find({status: "handleCompleted", app_year : year}).lean().execAsync(),
            // projectUpcoming: DocumentPackage.find({status: "projectUpcoming", app_year : year}).lean().execAsync(),
            // projectInProgress: DocumentPackage.find({status: "projectInProgress", app_year : year}).lean().execAsync(),
            // projectGoBacks: DocumentPackage.find({status: "projectGoBacks", app_year : year}).lean().execAsync(),
            // projectCompleted: DocumentPackage.find({status: "projectCompleted", app_year : year}).lean().execAsync()

            declined: DocumentPackage.find({status: "declined"}).lean().execAsync(),
            project: DocumentPackage.find({status: "project"}).lean().execAsync(),
            handleToBeAssigned: DocumentPackage.find({status: "handleToBeAssigned"}).lean().execAsync(),
            handleAssigned: DocumentPackage.find({status: "handleAssigned"}).lean().execAsync(),
            handleCompleted: DocumentPackage.find({status: "handleCompleted"}).lean().execAsync(),
            projectUpcoming: DocumentPackage.find({status: "projectUpcoming"}).lean().execAsync(),
            projectInProgress: DocumentPackage.find({status: "projectInProgress"}).lean().execAsync(),
            projectGoBacks: DocumentPackage.find({status: "projectGoBacks"}).lean().execAsync(),
            projectCompleted: DocumentPackage.find({status: "projectCompleted"}).lean().execAsync(),

            waitlist: DocumentPackage.find({ status: "waitlist" }).lean().execAsync()
        })
            .then(function (results) {
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

    /**
     * Description: retrieve all Project Packages from the database and group by status code
     * Type: GET
     * Params: none
     * Address: api.getProjectsByStatus
     * Returns: results.statuscode[array of Document Packages]
     * Notes: statuscode is defined as any property of Promise.props (ex: new, phone, assess)
     */
    getProjectsByStatus: function(req, res, next) {
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        // Access the returned items as results.<status code>[array index].<what you need>
        // Example: results.visit[3].address.line_1 = a string


        Promise.props({

            //handle: DocumentPackage.find({status: "handle", app_year: year}).lean().execAsync(),
            //project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync(),
            

            updatedHandle: DocumentPackage.update(
                // Condition
                {
                    status: "handle" ,
                    // app_year : year,
                    project:  { $exists: false } ,
                
                },
                // Updates
                {
                    // $set: {"project.status": "handle"},
                    $set: {"project": {status: "handle"}},
                },
                // Options
                {
                    multi: true
                }

                // Callback if needed
                // { }
            ).execAsync(),

            updatedProject: DocumentPackage.update(
                // Condition
                {
                    status: "project" ,
                    // app_year : year,
                    project:  { $exists: false } ,
                
                },
                // Updates
                {
                    // $set: {"project.status": "project"},
                    $set: {"project": {status: "project"}},
                },
                // Options
                {
                    multi: true
                }

                // Callback if needed
                // { }
            ).execAsync()

        }).then(function (firstRes) {
            // for (var i=0; i < firstRes.handle.length; i++) {
            //     if ((typeof firstRes.handle[i].project.status === 'undefined') && (firstRes.handle[i].status == "handle" || firstRes.handle[i].status == "project")){
            //         DocumentPackage.find({project: {status: "handleAssigned"}}).lean().execAsync();
            //     }
            // }

            // for (var j=0; j < firstRes.project.length; j++) {
            //     if ((typeof firstRes.project[j].project.status === 'undefined') && (firstRes.project[j].status == "project")) {
            //         DocumentPackage.find({project: {status: "handleAssigned"}}).lean().execAsync();
            //     }
            // }            

                    Promise.props({
                        // approval: DocumentPackage.find({status: "approval"}).lean().execAsync(),
                        
                        // handle: DocumentPackage.find({status: "handle", app_year : year}).lean().execAsync(),
                        // project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync(),

                        handle: DocumentPackage.find({"project.status": "handle"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        project: DocumentPackage.find({"project.status": "project"}).sort({ "project.project_start": 1 }).lean().execAsync(),

                        handleToBeAssigned: DocumentPackage.find({"project.status": "handleToBeAssigned"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectUpcoming: DocumentPackage.find({"project.status": "projectUpcoming"}).sort({ "application.name.last": 1 }).lean().execAsync(),
                        
                        handleAssigned: DocumentPackage.find({"project.status": "handleAssigned"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectInProgress: DocumentPackage.find({"project.status": "projectInProgress"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectGoBacks: DocumentPackage.find({"project.status": "projectGoBacks"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectCompleted: DocumentPackage.find({"project.status": "projectCompleted"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        handleCompleted: DocumentPackage.find({"project.status": "handleCompleted"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        nostatus: DocumentPackage.find({"project.status": "nostatus"}).sort({ "project.project_start": 1 }).lean().execAsync(),

                        completed: DocumentPackage.find({
                                "$or":  [
                                            {"project.status": "projectCompleted"}, 
                                            {"project.status": "handleCompleted"}
                                        ]
                        }).sort({ "project.project_start": 1 }).lean().execAsync()


                    })
                        .then(function (results) {
                            if (results) {

                                if (results.handle) {
                                    var obj = results.handle;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handle = obj;    
                                    });                                    
                                }
                                if (results.project) {
                                    var obj = results.project;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.project = obj;    
                                    });                                    
                                }
                                if (results.handleToBeAssigned) {
                                    var obj = results.handleToBeAssigned;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handleToBeAssigned = obj;    
                                    });                                    
                                }
                                if (results.projectUpcoming) {
                                    var obj = results.projectUpcoming;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectUpcoming = obj;    
                                    });                                    
                                }
                                if (results.handleAssigned) {
                                    var obj = results.handleAssigned;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handleAssigned = obj;    
                                    });                                    
                                }
                                if (results.projectInProgress) {
                                    var obj = results.projectInProgress;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectInProgress = obj;    
                                    });                                    
                                }
                                if (results.projectGoBacks) {
                                    var obj = results.projectGoBacks;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectGoBacks = obj;    
                                    });                                    
                                }
                                if (results.projectCompleted) {
                                    var obj = results.projectCompleted;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectCompleted = obj;    
                                    });                                    
                                }
                                if (results.handleCompleted) {
                                    var obj = results.handleCompleted;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handleCompleted = obj;    
                                    });                                    
                                }
                                if (results.nostatus) {
                                    var obj = results.nostatus;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.nostatus = obj;    
                                    });                                    
                                }
                            }
                            

                            res.locals.results = results;

                            // console.log("API :: Results: " + JSON.stringify(results));

                            // If we are at this line all promises have executed and returned
                            // Call next() to pass all of this glorious data to the next express router
                            next();
                        })
                        .catch(function(err) {
                            console.error(err);
                        })
                        .catch(next);


                })
    },



  // Fetch only status: "project" documents for this year.
  getProjectDocuments: function(req, res, next) {
    var currentYear = new Date().getFullYear();
    Promise.props({
      projects: DocumentPackage.find({ status: "project", app_year: currentYear }).lean().execAsync()

    }).then(function (results) {
      res.locals.projects = results.projects;

    }).catch(function (err) {
      console.log(err);
      next();
    })
  },
	
	getDocsByYear: function(req, res, next) {
		var year = req.body.year;
        if (req.body.doc_status == "project") {
        Promise.props({
            
            project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync()
        })
            .then(function (results) {
                if (!results) {
                    ;
                }
                else {
					for(var x=0; x<results.project.length; x++) {
						var updateYear = results.project[x].updated.getFullYear();
						//get month and day with padding since they are 0 indexed
						var updateDay = ( "00" + results.project[x].updated.getDate()).slice(-2);
						var updateMon = ("00" + (results.project[x].updated.getMonth()+1)).slice(-2);
						results.project[x].updated = updateYear + "/" + updateMon + "/" + updateDay;
						
						var sigYear = results.project[x].signature.client_date.getFullYear();
						//get month and day with padding since they are 0 indexed
						var sigDay = ( "00" + results.project[x].signature.client_date.getDate()).slice(-2);
						var sigMon = ("00" + (results.project[x].signature.client_date.getMonth()+1)).slice(-2);
						results.project[x].signature.client_date = sigYear + "/" + sigMon + "/" + sigDay;
						
						results.project[x].status = "Approved Project";
					}
					
                }
                res.locals.results = results;
				res.locals.status = 200;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
		}
		else if(req.body.doc_status == "unapproved") {
			
			var year = req.body.year;
			Promise.props({
            
            unapproved: DocumentPackage.find( {
				$and: [
				{app_year : year},
                    { $or: [{ status: "withdrawn" }, { status: "withdrawnooa" }, {status : "declined"}]}
				]
				
			}).lean().execAsync()
			})
            .then(function (results) {
                if (!results) {
                    ;
                }
                else {					
					for(var x=0; x<results.unapproved.length; x++) {
						var updateYear = results.unapproved[x].updated.getFullYear();
						//get month and day with padding since they are 0 indexed
						var updateDay = ( "00" + results.unapproved[x].updated.getDate()).slice(-2);
						var updateMon = ("00" + (results.unapproved[x].updated.getMonth()+1)).slice(-2);
						results.unapproved[x].updated = updateYear + "/" + updateMon + "/" + updateDay;
						
						var sigYear = results.unapproved[x].signature.client_date.getFullYear();
						//get month and day with padding since they are 0 indexed
						var sigDay = ( "00" + results.unapproved[x].signature.client_date.getDate()).slice(-2);
						var sigMon = ("00" + (results.unapproved[x].signature.client_date.getMonth()+1)).slice(-2);
						results.unapproved[x].signature.client_date = sigYear + "/" + sigMon + "/" + sigDay;
						
						//results.unapproved[x].status = "Unapproved Project";
					}
					
                }
                res.locals.results = results;
				res.locals.status = 200;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
			
		}
    },
	

    /**
     * Description: add a Document Package to the database
     * Type: POST
     * Params: none
     * Address: api.postDocument
     * Returns: HTML 200 status code
     */
    postDocument: function(req, res, next) {
        // Data will be submitted using req.body
		
		//var currentTime = new Date();
		//var year = req.body.signature.client_date.getFullYear();
		var year = new Date(req.body.signature.client_date).getFullYear();

		Promise.props({
			docInSys: DocumentPackage.count({app_year : year}).lean().execAsync()
		})
		.then(function (results) {
                if (!results) {
                    ;
                }
                else {
					var count = results.docInSys;
					count++;
										
					var app_name = "A" + year.toString() + "-" + count.toString();
					// Normally we would create a new mongoose object to be instantiated
					// var doc = new DocumentPackage();
					// And then add data to it
					// doc.status = 'a string here';
					// doc.application.name.first = 'name here'

					// Instead we will do it in one line
					var doc = new DocumentPackage(req.body);

					// Create a corresponding highlight package
					var highlight = new HighlightPackage();

					// Make each reference the others ObectId
					// TODO: Add support for work items and site assessment
					doc.highlightPackage = highlight._id;
					doc.app_name = app_name;
					doc.app_year = year;
					highlight.documentPackage = doc._id;

					var finance = new FinancialPackage();
					finance.appID = doc._id;
					//finance.name.first = req.body.application.name.first;
					//finance.name.last = req.body.application.name.last;
					var name = req.body.application.name.first + " " + req.body.application.name.last;
					finance.name = name;

					// Save the document package to the database with a callback to handle flow control
					doc.saveAsync(function (err, doc, numAffected) {
						if (err) {
							console.error(err);
						}
					});

					// Save the highlight package to the database with a callback to handle flow control
					highlight.saveAsync(function (err, highlight, numAffected) {
						if (err) {
							console.error(err);
						}
						else {
							//res.send( { status : 200 } );
						}
					});


					finance.saveAsync(function (err, highlight, numAffected) {
						if (err) {
							console.error(err);
						}
						else {
							//res.send( { status : 200 } );
						}
					});

					for (var i=0; i<req.body.count; i++) {
						var family = new FinancialPackage();
						family.appID = doc._id;
						family.name = req.body.application.other_residents.name[i];

						family.saveAsync(function (err, highlight, numAffected) {
							if (err) {
								console.error(err);
							}
							else {
								//res.send( { status : 200 } );
							}
						});
						
					}
					res.send( { status : 200 } );

				}

            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);

    },

    /**
     * Description: update a name:value pair in a Document Package
     * Type: PUT
     * Params: _id, name, value
     * Address: api.putUpdateDocument
     * Returns: results as modified Document Package
     */
    putUpdateDocument: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc
		var updates = {};
		var id;
		if(res.locals.role == "SITE") {
			if(req.body.name == "notes.site_summary") {
			     updates['notes.site_summary'] = req.body.value;
			}
			else if(req.body.name == "status") {
                if (req.body.value && ((req.body.value == "project") || (req.body.value == "handle"))) {
                    updates['project.status']= req.body.value;
                }
				updates['status'] = req.body.value;
			}
			id = req.body.id;
		}
        else if (req.body.name == "status") {
                if (req.body.value && ((req.body.value == "project") || (req.body.value == "handle"))) {
                    updates['project.status']= req.body.value;
                }
                updates['status'] = req.body.value;

                if(req.params.id != null) {
                    id = req.params.id;
                }
                else {
                    id = req.body.id;
                }
            }
        // else if (req.body.name == "drive_url") {
        //         console.log("[ API ] putUpdateDocument :: Save Google drive URL Called");
                
        //         if (req.body.value) {
        //             var inStatus = { drive_url: req.body.value };
        //             updates.drive = inStatus;
        //         }
        //        // updates['status'] = req.body.value;

        //         if(req.params.id != null) {
        //             id = req.params.id;
        //         }
        //         else {
        //             id = req.body.id;
        //         }
        // }
		else {
		
			if(req.params.id != null) {
				id = req.params.id;
			}
			else {
				id = req.body.id;
			}
			// Build the name:value pairs to be updated
			// Since there is only one name and one value, we can use the method below
			
			updates[req.body.name] = req.body.value;
			// Record Update time
			//filters
		}
        var conditions = {};
        conditions['_id'] = mongoose.Types.ObjectId(id);
        updates['updated'] = Date.now();

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



    


    putUpdateProject: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc
        var updates = {};
        var id;
        // if(res.locals.role == "SITE") {
        //     if(req.body.name == "notes.site_summary") {
        //         updates['notes.site_summary'] = req.body.value;
        //     }
        //     id = req.body.id;
        // }
        if(req.body.name == "status") {

            if (req.body.value == 'projWithdrawn') {

                updates =   {   "status":"withdrawn",
                                "project.status":req.body.value 
                            };
            } else if (req.body.value == 'projDeclined') {

                updates =   { 
                                "status":"declined",
                                "project.status":req.body.value 
                            };
            } else {
                updates = {"project.status":req.body.value };
            }

            //updates = {project: {"status": req.body.value}};
        }
        else if (req.body.name == "crew_chief") {
                updates = {"project.crew_chief":req.body.value };
        }
        else if (req.body.name == "project_advocate") {
                updates = {"project.project_advocate":req.body.value };
        }
        else if (req.body.name == "site_host") {
                updates = {"project.site_host":req.body.value };
        }

        else if (req.body.name == "actual_volunteer_count") {
                updates = {"project.actual_volunteer_count":req.body.value };
        }

        else if (req.body.name == "actual_labor_count") {
                updates = {"project.actual_labor_count":req.body.value };
        } else if (req.body.name == "project.project_start") {
                updates = {"project.project_start":req.body.value };
        } else if (req.body.name == "project.project_end") {
                updates = {"project.project_end":req.body.value };
        } else if (req.body.name == "drive_url") {
                updates = {"drive.drive_url":req.body.value };
        }   

        // else {
        
        //     if(req.params.id != null) {
        //         id = req.params.id;
        //     }
        //     else {
        //         id = req.body.id;
        //     }
        //     // Build the name:value pairs to be updated
        //     // Since there is only one name and one value, we can use the method below
            
        //     updates[req.body.name] = req.body.value;
        //     // Record Update time
        //     //filters
        // }

        // if(req.params.id != null) {
        //         id = req.params.id;
        //     }
        // else {
        //         id = req.body.id || null;
        //     }
        var conditions = {};
        conditions['_id'] = req.params.id || mongoose.Types.ObjectId(id);
        updates['updated'] = Date.now();


        Promise.props({
            project: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    //upsert: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



    putUpdateWork: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        // Log the _id, name, and value that are passed to the function
        var updates = {};
        var id;
 
     
        if (req.body.name == "isHandle") {
            if (req.body.value == true) {
                updates = { "isHandle": true };
            } else {
                updates = { "isHandle": false };
            }
        }

        var conditions = {};
        conditions['_id'] = req.params.id || mongoose.Types.ObjectId(id);
        updates['updated'] = Date.now();


        // Promise.props({
        //     project: DocumentPackage.findOneAndUpdate(
        //         // Condition
        //         conditions,
        //         // Updates
        //         {
        //             // $set: {name: value}
        //             $set: updates
        //         },
        //         // Options
        //         {
        //             // new - defaults to false, returns the modified document when true, or the original when false
        //             new: true,
        //             //upsert: true
        //         }
        //         // Callback if needed
        //         // { }
        //     ).execAsync()
        // })

        Promise.props({
        item: WorkItemPackage.findOneAndUpdate(
            // Condition
               conditions,
               // Updates
               {
                   $set: updates
               },
               // Options
               {
                   // new - defaults to false, returns the modified document when true, or the original when false
                   new: true,
                   // runValidators - defaults to false, make sure the data fits the model before applying the update
                   runValidators: true
               }
                   ).execAsync()
        })

            .then(function (results) {
                // TODO: Confirm true/false is correct
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },


	postUser: function(req, res, next) {
        // Data will be submitted using req.body

        //create new mongoose object
        var doc = new UserPackage(req.body);
		doc.setPassword(req.body.password);






        // Save the user package to the database with a callback to handle flow control
        doc.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            } else {
				res.send( { status : 200 } );
            }
        });
        
    },

	updateUser: function(req, res, next) {
        // When executed this will apply updates to a user and return the MODIFIED user
        // Log the _id, name, and value that are passed to the function

        // Note that the _id will actually come in with the key "pk"... Sorry, it's an x-editable thing - DM
		//res.locals.status = 200;
		//next();
        // Build the name:value pairs to be updated
        // Since there is only one name and one value, we can use the method below

		if(req.body.name == "password") {
			var conditions = {};
			var updates = {};
			conditions['_id'] = req.body.pk;
			var salt = crypto.randomBytes(16).toString('hex');
			var hash = crypto.pbkdf2Sync(req.body.value, salt, 1000, 64, 'sha512').toString('hex');
			
			updates.salt = salt;
			updates.hash = hash;
			Promise.props({
				user: UserPackage.findOneAndUpdate(
					// Condition
					conditions,
					// Updates
					{
						 $set: updates

					},
					// Options
					{
						// new - defaults to false, returns the modified document when true, or the original when false
						new: true,
						// runValidators - defaults to false, make sure the data fits the model before applying the update
						runValidators: true
					}
					// Callback if needed
					// { }
				).execAsync()
			})
				.then(function (results) {
					// TODO: Confirm true/false is correct
					res.locals.results = results;
					//sending a status of 200 for now
					res.locals.status = '200';

					// If we are at this line all promises have executed and returned
					// Call next() to pass all of this glorious data to the next express router
					next();
				})
				.catch(function (err) {
					console.error(err);
				})
				.catch(next);
		}
			
		else {

				var updates = {};
				updates[req.body.name] = req.body.value;


				// Record Update time
				//filters
				var conditions = {};
				conditions['_id'] = req.body.pk;
				updates['updated'] = Date.now();

				Promise.props({
					user: UserPackage.findOneAndUpdate(
						// Condition
						conditions,
						// Updates
						{
							// $set: {name: value}
							$set: updates
						},
						// Options
						{
							// new - defaults to false, returns the modified document when true, or the original when false
							new: true,
							// runValidators - defaults to false, make sure the data fits the model before applying the update
							runValidators: true
						}
						// Callback if needed
						// { }
					).execAsync()
				})
					.then(function (results) {
						// TODO: Confirm true/false is correct
						res.locals.results = results;
						//sending a status of 200 for now
						res.locals.status = '200';

						// If we are at this line all promises have executed and returned
						// Call next() to pass all of this glorious data to the next express router
						next();
					})
					.catch(function (err) {
						console.error(err);
					})
					.catch(next);
		}
    },

    updateUserRoles: function(req, res, next) {
        // When executed this will apply updates to a user and return the MODIFIED user
        // Log the _id, name, and value that are passed to the function

		//res.locals.status = 200;
		//next();
        // Build the name:value pairs to be updated
        // Since there is only one name and one value, we can use the method below

		
			
		        var updates = {};
				//updates[req.body.name] = req.body.value;
               
                var user_roles = JSON.parse(req.body.user_roles);
              
				// Record Update time
				//filters
				var conditions = {};
                conditions['_id'] = req.body.Id;
                updates['user_roles'] = user_roles;
                
               
                updates['updated'] = Date.now();

				Promise.props({
					user: UserPackage.findOneAndUpdate(
						// Condition
						conditions,
						// Updates
						{
							// $set: {name: value}
							$set: updates
						},
						// Options
						{
							// new - defaults to false, returns the modified document when true, or the original when false
							new: true,
							// runValidators - defaults to false, make sure the data fits the model before applying the update
							runValidators: true
						}
						// Callback if needed
						// { }
					).execAsync()
				})
					.then(function (results) {
                        // TODO: Confirm true/false is correct
                        
						res.locals.results = results;
						//sending a status of 200 for now
						res.locals.status = '200';

						// If we are at this line all promises have executed and returned
						// Call next() to pass all of this glorious data to the next express router
						next();
					})
					.catch(function (err) {
						console.error(err);
					})
					.catch(next);
		
    },


	updatePassword: function(req, res, next) {
        // When executed this will apply updates to a user and return the MODIFIED user
        // Log the _id, name, and value that are passed to the function

        // Note that the _id will actually come in with the key "pk"... Sorry, it's an x-editable thing - DM

	   var passCorrect = true;
	   var hash;
	   var salt;
	   var newhash;
		//res.locals.status = 200;
		//next();
        Promise.props({
				user: UserPackage.findById(req.body.pk).lean().execAsync()
			})
            .then(function(results) {
                if (!results) {
					res.locals.status = 500;
                }
                else {
					hash = crypto.pbkdf2Sync(req.body.oldPass, results.user.salt, 1000, 64, 'sha512').toString('hex');
					if(hash != req.user.hash) {
						res.locals.status = 500;
						next();
						passCorrect = false;

					}
					else {
						salt = results.user.salt;
					}
				}
			})
			.then(function(results) {
						if(passCorrect == false) {
							res.locals.status = 500;
							next();
						}
						else {
						var conditions = {};
						var updates = {};
                        conditions['_id'] = req.body.pk;
                        
						var newsalt = crypto.randomBytes(16).toString('hex');
						var newhash = crypto.pbkdf2Sync(req.body.newPass, newsalt, 1000, 64, 'sha512').toString('hex');
						
						updates.salt = newsalt;
                        updates.hash = newhash;
                        
						Promise.props({
							userChange: UserPackage.findOneAndUpdate(
								// Condition
								conditions,
								// Updates
								{
									 $set: updates

								},
								// Options
								{
									// new - defaults to false, returns the modified document when true, or the original when false
									new: true,
									// runValidators - defaults to false, make sure the data fits the model before applying the update
									runValidators: true
								}
								// Callback if needed
								// { }
							).execAsync()
						})
							.then(function (results) {
                                // TODO: Confirm true/false is correct
                                
								res.locals.results = results;
								//sending a status of 200 for now
								res.locals.status = '200';

								// If we are at this line all promises have executed and returned
								// Call next() to pass all of this glorious data to the next express router
								//next();
							})
							.catch(function (err) {
								console.error(err);
							})
							//.catch(next);

					/*if(results.user.validPassword(req.body.oldPass)) {
						console.log("valid password");
						results.user.setPassword(req.body.newPass)
						res.locals.status = 200;
					}
					else {
						//invalid password
						res.locals.status = 500;
					}*/


				res.locals.status = 200;
                res.locals.results = results;
                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
						}
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);



    },



	//create user roles on initial site deployment
	createRoles: function(req, res, next) {
		var vet = new RolePackage();
		vet.role_name = "VET";
		vet.role_display = "Vetting Agent";

		var site = new RolePackage();
		site.role_name = "SITE";
		site.role_display = "Site Agent";

		var admin = new RolePackage();
		admin.role_name = "ADMIN";
        admin.role_display = "Admin";
        
        var projectmanger = new RolePackage();
		projectmanger.role_name = "PROJECT_MANAGEMENT";
		projectmanger.role_display = "Project Management";

		vet.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else {
				//res.send( { status : 200 } );
            }
        });


		site.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else {
				//res.send( { status : 200 } );
            }
        });

		admin.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else if (numAffected == 1) {
				next();
            }
        });
	},

	updateService: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        // Log the _id, name, and value that are passed to the function

        // Build the name:value pairs to be updated
        // Since there is only one name and one value, we can use the method below
        var updates = {};
		updates.service_area = req.body.value;

		//if out of service area, change status to "on hold, pending discussion"
		if(req.body.value == false) {
			updates.status = "discuss";
		}

		// Record Update time
        //filters
        var conditions = {};
        conditions['_id'] = req.body.appId;
        updates['updated'] = Date.now();

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct

                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },


    //post create Partner       //next
    createPartner: function(req, res, next) {
        var item = new PartnerPackage(req.body);

        item.saveAsync(function (err, note, numAffected) {
            if (err) {
                console.log ('[ API ] :: createPartner error.');
                console.error(err);
            } else {
                //send note ID so it can be referenced without page refresh
                //res.send( { status : 200, _id: item._id } );
                res.locals.status = '200';
            }
            next();
        });
    },

    //post delete Partner           //next
    deletePartner: function(req, res, next) {
        Promise.props({
            note: PartnerPackage.remove(
                {
                    _id: req.body._id
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            else {
                console.log('[ API ] deletePartner :: Partner found: FALSE');
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

    putUpdatePartner: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc
        var conditions = {};
        conditions['_id'] = req.params.id;

        var updates = {};
        updates[req.body.name] = req.body.value;

        Promise.props({
            project: PartnerPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    //upsert: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct

                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



    //post get all Partners
    getPartner: function(req, res, next) {
        Promise.props({
            partner: PartnerPackage.find().execAsync(),
            count: PartnerPackage.count().execAsync()
        })
        .then(function (results) {
            if (results) {
                res.locals.results = results;
                res.locals.status = '200';
            }
            else {
                console.log('[ API ] getPartner :: Partner(s) found: FALSE');
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

    //post - GET (Retrieve) partners and leaders associated to that project
    getSummaryPartners: function(req, res, next) {
        //var projectId =  ObjectId(req.params.id) ||req.params.id || req.body.projectId;

        //res.locals.docId = projectId;

        // var projectId = String(req.body.projectId);
        var resArray = [];

        Promise.props({
            allPartners: PartnerPackage.find().sort({ "org_name": 1 }).execAsync(),
            pCount: PartnerPackage.count().execAsync(),
            assocPartners: ProjectSummaryPackage.find({ projectId: { $exists: true } }).execAsync()
        })
        .then(function (assocRes) {
            
            if (assocRes) {
            var allPartners = assocRes.allPartners;                             //Array of Objects

            var unAssocArray = assocRes.allPartners;  
            var uIDs = [];

            var asso = assocRes.assocPartners.length;

              var assocPartners;

                var m; 
                var allCnt;
                var aCnt;
                var k;
            for (k = 0; k < asso; k++) {
                assocPartners = assocRes.assocPartners[k].assocPartners || null;   
              if (assocPartners) {  
                for (aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                    for (allCnt=0; allCnt < allPartners.length; allCnt++) {    
                        if (allPartners[allCnt]._id == assocPartners[aCnt]) {
                                m = assocRes.assocPartners[k].projectId;
                                if (resArray[m]) {
                                    resArray[m].push(allPartners[allCnt].org_name);
                                } else {
                                    resArray[m] = [];
                                    resArray[m].push(allPartners[allCnt].org_name);
                                }
                                //break;

                        } 
                        else if (allCnt + 1 == allPartners.length) {
                            uIDs.push(assocPartners[aCnt]);
                        }
                    }
                }
              }
            }
                    // var filtered = unAssocArray.filter(customFilter);

                    // function customFilter(eachObj) {
                    //     var isFound = false;
                    //     for (var aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                    //         if (eachObj._id == assocPartners[aCnt]) {
                    //             isFound = true; 
                    //         } 
                    //     }
                    //     return (! isFound);
                    // }


            var sendRes =   { 
                                pAll:   allPartners, 
                                // aCount: assocRes.pCount, 
                                pAssoc: resArray,
                                // aIDs:   assocPartners,
                               // uAssoc: filtered,
                             //   projectId: projectId
                                // uCount: filtered.length,
                                // uIDs:   uIDs
                            };
            req.partnerTime = sendRes;
            res.locals.results.part = sendRes;
            // req.partnerTime = sendRes;
            res.locals.status = '200';
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },



    //post - GET (Retrieve) partners and leaders associated to that project
    getProjPartnersLeaders: function(req, res, next) {
        
        var projectId =  ObjectId(req.params.id) ||req.params.id || req.body.projectId;                    

        res.locals.docId = projectId;

        // var projectId = String(req.body.projectId);
        var resArray = [];
        //var unAssocArray = [];


        Promise.props({
            allPartners: PartnerPackage.find().sort({ "org_name": 1 }).execAsync(),
            pCount: PartnerPackage.count().execAsync(),
            assocPartners: ProjectSummaryPackage.find({"projectId": projectId }).execAsync()
            // assocPartners: ProjectSummaryPackage.findAllAndUpdate(
            //                 {"projectId": projectId },
            //                 { $setOnInsert: {"projectId": projectId } }, 
            //                 { returnOriginal: false,
            //                           upsert: true   }
            // ).execAsync()
        })
        .then(function (assocRes) {
            
            var allPartners = assocRes.allPartners;                             //Array of Objects

            var unAssocArray = assocRes.allPartners;  
            var uIDs = [];

            if (! assocRes.assocPartners[0]) {
                // var empty = [];
                // var newBody = {    "projectId": projectId 
                //               };

                var item = new ProjectSummaryPackage({"projectId": projectId });

                item.saveAsync(function (err, note, numAffected) {
                    if (err) {
                        console.error(err);
                    }
                    else  {

                        var newSendRes =   { 
                                            pAll:   allPartners, 
                                            pAssoc: {},
                                            uAssoc: allPartners,
                                            projectId: projectId
                                        };

                        res.locals.results.part = newSendRes;
                        req.partnerTime = newSendRes;
                        res.locals.status = '200';
                    }
                });


            } 



            else if (assocRes) {
              var assocPartners = assocRes.assocPartners[0].assocPartners || null;        //An array of IDS
                
                for (var aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                    for (var allCnt=0; allCnt < allPartners.length; allCnt++) {    
                        if (allPartners[allCnt]._id == assocPartners[aCnt]) {
                                resArray.push(allPartners[allCnt]);
                                //break;

                        } 
                        else if (allCnt + 1 == allPartners.length) {
                            uIDs.push(assocPartners[aCnt]);
                        }
                    }
                }

                    var filtered = unAssocArray.filter(customFilter);

                    function customFilter(eachObj) {
                        var isFound = false;
                        for (var aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                            if (eachObj._id == assocPartners[aCnt]) {
                                isFound = true; 
                            } 
                        }
                        return (! isFound);
                    }
            //res.locals.results = results;
            // res.locals.results = { ans: JSON.stringify(resArray) };
            // res.locals.results = assocRes.allPartners;

            var sendRes =   { 
                                pAll:   allPartners, 
                                // aCount: assocRes.pCount, 
                                pAssoc: resArray,
                                // aIDs:   assocPartners,
                                uAssoc: filtered,
                                projectId: projectId
                                // uCount: filtered.length,
                                // uIDs:   uIDs
                            };
            req.partnerTime = sendRes;
            res.locals.results.part = sendRes;
            // req.partnerTime = sendRes;
            res.locals.status = '200';
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },


    //post - SET (Store) partners and leaders associated to that project
    setProjPartnersLeaders: function(req, res, next) {
        var projectId = req.body.projectId || res.locals.docId;
        // var item = new ProjectSummaryPackage(req.body);

        Promise.props({
            updateStatus:   ProjectSummaryPackage.update(
                                {"projectId": projectId },           //Query
                                {  $set: {
                                            "assocPartners": req.body.assocArray
                                          }
                                },   
                                { 
                                    upsert: true,
                                    new: true
                                }
                            ).execAsync()
        })
        .then(function (thisRes) {
            if (thisRes) {

            res.locals.results = thisRes;
            res.locals.status = '200';
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },


    /**
     * Description: add a vetting note to the database
     * Type: POST
     * Params: none
     * Address: api.postVettingNote
     * Returns: _id of newly created Vetting Note
     */
    postVettingNote: function(req, res, next) {
		var userID = req.body.user.toString();
		Promise.props({
            user: UserPackage.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    console.log('[ API ] postVettingNote :: User package found: FALSE');
                }
                else {
					var note = new VettingNotePackage(req.body);
					var firstName = results.user.contact_info.user_name.user_first;
					note.vetAgent = results.user.contact_info.user_name.user_first + " " + results.user.contact_info.user_name.user_last;

					note.saveAsync(function (err, note) {
						if (note && note._id) {
							//send note ID so it can be referenced without page refresh
							res.send( { status : 200, noteId: note._id, vetAgent: note.vetAgent } );
						} else {
                            console.error(err);
                            res.send( { status : 500, message: 'Error: Cannot create note. Please retry...' } );
						}
					})
				}
			})
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);


    },

    postProjectNote: function(req, res, next) {
		var userID = req.body.user.toString();
		Promise.props({
            user: UserPackage.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    console.log('[ API ] postProjectNote :: User package found: FALSE');
                }
                else {
					var note = new ProjectNotePackage(req.body);
					var firstName = results.user.contact_info.user_name.user_first;
                    note.projectPlanner = results.user.contact_info.user_name.user_first + " " + results.user.contact_info.user_name.user_last;
                    
					note.saveAsync(function (err, note, numAffected) {
						if (note && note._id) {
							//send note ID so it can be referenced without page refresh
							res.send( { status : 200, noteId: note._id, projectPlanner: note.projectPlanner } );
						} else {
                            console.error(err);
                            res.send( { status : 500, message: 'Could not save note. Please try again...'} );
						}
					})
				}
			})
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);


    },

	//post new work item
	addWorkItem: function(req, res, next) {
        var item = new WorkItemPackage(req.body);

        item.saveAsync(function (err, note, numAffected) {
            if (err) {
                console.error(err);
            } else {
                //send note ID so it can be referenced without page refresh
                res.send( { status : 200, itemId: item._id } );
            }
        });

    },


    /**
     * Description: remove a vetting note from the database
     * Type: POST
     * Params: _id of Vetting Note
     * Address: api.removeVettingNote
     * Returns: confirmation of delete
     */
    removeVettingNote: function(req, res, next) {
        Promise.props({
            note: VettingNotePackage.remove(
                {
                    _id: req.body.noteId
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

    /**
     * Description: remove a vetting note from the database
     * Type: POST
     * Params: _id of Vetting Note
     * Address: api.removeVettingNote
     * Returns: confirmation of delete
     */
    removeProjectNote: function(req, res, next) {
        Promise.props({
            note: ProjectNotePackage.remove(
                {
                    _id: req.body.noteId
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

	//delete work item
	deleteWorkItem: function(req, res, next) {
        Promise.props({
            note: WorkItemPackage.remove(
                {
                    _id: req.body.itemId
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            else {
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },
    /**
     * Description: update or edit a Vetting Note
     * Type: POST
     * Params: _id, name, value
     * Address: api.updateVettingNote
     * Returns: results as an updated Vetting Note
     */
    updateVettingNote: function(req, res, next) {
        var updates = {};
        updates.description = req.body.description;

        //filters
        var conditions = {};
        conditions['_id'] = req.body.id;

        Promise.props({
            note: VettingNotePackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (results.note != null) {
                    res.locals.status = '200';
                }
                else {
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    updateProjectNote: function(req, res, next) {
        var updates = {};
        updates.description = req.body.description;

        //filters
        var conditions = {};
        conditions['_id'] = req.body.id;

        Promise.props({
            note: ProjectNotePackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (results.note != null) {
                    res.locals.status = '200';
                }
                else {
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



	updateWorkItem: function(req, res, next) {
		//res.locals.status = 200;
		//next();
        var updates = {};
		//TODO: add name??
		updates.description = req.body.description;
		if(req.body.name != null) {
			updates.name = req.body.name;
		}
		updates.cost = req.body.cost;
		updates.updated = Date.now();
 
        if(req.body.siteComments != null) {
            updates.siteComments = req.body.siteComments;
        }
        if(req.body.vettingComments != null) {
            updates.vettingComments = req.body.vettingComments;
        }
        if(req.body.projectComments != null)
        {
            updates.projectComments = req.body.projectComments;
        }

        if(res.locals.role === undefined || res.locals.role==='')
        {
            if(req.body.siteComments != null) {
                updates.siteComments = req.body.siteComments;
            }
        }
       // else
       // {
		if(res.locals.user_roles.indexOf("ADMIN") !== -1) {
			if(req.body.siteComments != null) {
				updates.siteComments = req.body.siteComments;
			}
			if(req.body.vettingComments != null) {
				updates.vettingComments = req.body.vettingComments;
            }
            if(req.body.projectComments != null)
            {
                updates.projectComments = req.body.projectComments;
            }
		}
        // else if(res.locals.role == "ADMIN") {
        //     if(req.body.siteComments != null) {
        //         updates.siteComments = req.body.siteComments;
        //     }
        //     if(req.body.vettingComments != null) {
        //         updates.vettingComments = req.body.vettingComments;
        //     }
        //     if(req.body.projectComments != null)
        //     {
        //         updates.projectComments = req.body.projectComments;
        //     }
        // }
        if(res.locals.user_roles.indexOf("PROJECT_MANAGEMENT") !== -1) {
            if(req.body.projectComments != null) {
                updates.projectComments = req.body.projectComments;
            }
        }
        else if(res.locals.role == "PROJECT_MANAGEMENT") {
            if(req.body.projectComments != null) {
                updates.projectComments = req.body.projectComments;
            }
           
        }
		if(res.locals.user_roles.indexOf("SITE") !== -1) {
            if(req.body.siteComments != null) {
				updates.siteComments = req.body.siteComments;
			}

            // if(req.body.projectComments != null)
            // {
            //     updates.projectComments = req.body.projectComments;
            // }
		}
        if(res.locals.user_roles.indexOf("VET") !== -1) {
            if(req.body.vettingComments != null) {
                updates.vettingComments = req.body.vettingComments;
            }
        }

        else {
			if(req.body.vettingComments != null) {
                updates.vettingComments = req.body.vettingComments;
                
            }
           
        }
        
        if(req.body.siteComments != null) {
            updates.siteComments = req.body.siteComments;
        }
  // }
        //filters
        var conditions = {};
        conditions['_id'] = req.body.id;

        Promise.props({
            item: WorkItemPackage.findOneAndUpdate(
			 // Condition
                conditions,
                // Updates
                {
					$set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {

                if (results.item != null) {
                    res.locals.status = '200';
                }
                else {
                    res.locals.status = '500';
                }
                res.locals.results = results;
				  // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })

            .catch(next);



	},


  // Create / Update Assessment Checklist record
  saveAssessmentDocument: function(req, res, next) {

    Promise.props({
      assessment: AssessmentPackage.findOneAndUpdate(
          { applicationId: req.body.applicationId },
          { $set: req.body },
          { new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
          }
      ).execAsync()
    }).then(function (results) {
      if (results.assessment !== null) {
        console.log('[ API ] saveAssessmentDocument :: Assessment found: TRUE');
        res.locals.status = '200';
      } else {
        console.log('[ API ] saveAssessmentDocument :: Assessment found: FALSE');
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  // Create / Update Project Plan record
  saveProjectPlanDocument: function(req, res, next) {
    Promise.props({
      projectPlan: ProjectPlanPackage.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        { $set: req.body },
        { new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).execAsync()
    }).then(function (results) {
      if (results.projectPlan !== null) {
        res.locals.status = '200';
      } else {
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  // Save Custom Checklist Note
  saveCustomChecklist: function(req, res, next) {
    var n = req.body.name || "custom";
    var upName = n + ".note";
    var updates = {};
    //updates[n] = {"note": req.body.value};
    //var q = {};

    var bVal = "";

    if (req.body.value !== 'Empty') {
        bVal = req.body.value;
    } 

    updates[upName] = bVal;
    //const key = `${n}.newProp`;
    //updates[n].note = req.body.value;
    
    //var applId = req.body.applicationId || 
    //req.body.applicationId = 

    Promise.props({
      plan: ProjectPlanPackage.findOneAndUpdate(
        { applicationId: req.params.id },
        { $set: updates },
        { new: true,
          upsert: true,
          runValidators: false,
          setDefaultsOnInsert: false
        }
      ).execAsync()
    }).then(function (results) {
      if (results.plan !== null) {
        res.locals.status = '200';
      } else {
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },



	//update financial package
	updateFinance: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        // Log the _id, name, and value that are passed to the function
		var userID;
		var name1;
		var name2;
		var value;

		Object.keys(req.body).forEach(function(prop) {
			userID = prop;
			Object.keys(req.body[prop]).forEach(function(data) {
				name1 = data;
				Object.keys((req.body[prop])[data]).forEach(function(bool) {
					name2 = bool;
					value = ((req.body[prop])[data])[bool];
				});
			});
		});

        // Build the name:value pairs to be updated

        var updates = {};
		if (name2 != "note") {
		var name = name1.toString() + "." + name2.toString();
		}
		else {
			name = name1;
		}
		updates[name] = value;

		// Record Update
        //filters
        var conditions = {};
        conditions['_id'] = mongoose.Types.ObjectId(userID);

        Promise.props({
            fin: FinancialPackage.findOneAndUpdate(
			 // Condition
                conditions,
                // Updates
                {
					$set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
				next();
			})
            .catch(function (err) {
                console.error(err);
            })

            .catch(next);

    },
    /**
     * Description: retrieve a Highlight Package from the database by id
     * Type: GET
     * Params: _id
     * Address: api.getHighlightsById
     * Returns: results as a Highlight Package
     */
    getHighlightsById: function(req, res, next) {
        Promise.props({
            highlight: HighlightPackage.findById(req.params.id).lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    console.log('[ API ] getHighlightsById :: Highlight package found: FALSE');
                }
                else {
                    console.log('[ API ] getHighlightsById :: Highlight package found: TRUE');
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

    /**
     * Description: invert a boolean value in a Highlight Package
     * Type: GET
     * Params: _id
     * Address: api.toggleHighlight
     * Returns: results as updated Highlight Package
     */
    toggleHighlight: function(req, res, next) {
        // Confirm a JSON {key:value} pair was sent
        if (req.accepts('application/json')) {
            var fetchDocument = Promise.props({
                highlight: HighlightPackage.findById(req.params.id).lean().execAsync()
            })
                .then(function (results) {

                    // Build the name:value pairs to be updated
                    // Since there is only one name and one value, we can use the method below
                    var updates = {};
                    // updates[req.body.name] = req.body.value;

                    var str = req.body.name;
                    var str_split = str.split('.');
                    var length = str_split.length;

                    if (length == 1) {
                        console.log(results.highlight[ str_split[0] ]);
                        if (results.highlight[str_split[0]] === true) {
                            updates[req.body.name] = false;
                        }
                        if (results.highlight[str_split[0]] === false) {
                            updates[req.body.name] = true;
                        }
                    }
                    if (length == 2) {
                        if (results.highlight[ str_split[0] ][ str_split[1] ] === true) {
                            updates[req.body.name] = false;
                        }
                        if (results.highlight[ str_split[0] ][ str_split[1] ] === false) {
                            updates[req.body.name] = true;
                        }
                    }

                    // Record Update time
                    updates['updated'] = Date.now();

                    // Build variables and attach to the returned query results
                    results.id = req.params.id;
                    results.name = req.body.name;
                    // results.value = req.body.value;
                    results.updates = updates;

                    return results;
                })
                .catch(function (err) {
                    console.error(err);
                })
                .catch(next);

            fetchDocument.then(function(results) {
                Promise.props({
                    highlight: HighlightPackage.findOneAndUpdate(
                        // Condition
                        {_id: results.id},
                        // Updates
                        {
                            $set: results.updates
                        },
                        // Options
                        {
                            // new - defaults to false, returns the modified document when true, or the original when false
                            new: true,
                            // runValidators - defaults to false, make sure the data fits the model before applying the update
                            runValidators: true
                        }
                    ).execAsync()

                })
                    .then(function(results){
                        if (!results) {
                            ;
                        }
                        else {
                            res.locals.results = results;
                            //sending a status of 200 for now
                            res.locals.status = '200';
                        }
                        next();
                    })
                    .catch(function (err) {
                        console.error(err);
                    })
                    .catch(next);
            })
        }
    },

    /**
     * Description: update a name:value pair in an array in a Document Package
     * Type: PUT
     * Params: _id, name, value, index
     * Address: api.putUpdateArray
     * Returns: results as modified Document Package
     */
    putUpdateArray: function(req, res, next) {
        //the $ holds the index of the element
		if(req.body.name == "application.other_residents.name") {
			if(req.body.pk == "") {
				;
			}
		}
        var updateField = req.body.name + ".$";
        var updates = {};
        updates[updateField] = req.body.value;
        // Record Update time
        updates['updated'] = Date.now();
        //filters
        var conditions = {};
        conditions['_id'] = req.params.id;
        conditions[req.body.name] = req.body.pk;

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (results.doc != null) {
					if(req.body.name == "application.other_residents.name") {
						var finance = new FinancialPackage();
						if(req.body.pk == "") {
							finance.appID = req.params.id;
							finance.name = req.body.value;
							finance.saveAsync(function (err, highlight, numAffected) {
								if (err) {
									console.error(err);
								}
								else {
									//res.send( { status : 200 } );
								}
							});

						}
						else {
							if(req.body.value == ""){
								Promise.props({
								fin: FinancialPackage.remove(
									{
										appID: req.params.id,
										name: req.body.pk

									}
								).execAsync()
							})
							.then(function (results) {
								if (results) {
									//res.locals.results = results;
									//sending a status of 200 for now
									//res.locals.status = '200';
								}
								else {
									;
								}
								//next();
							})
							.catch(function (err) {
								console.error(err);
							});

							}
							else {
							var finUpdates = {};
							finUpdates['name'] = req.body.value;
							// Record Update time
							//updates['updated'] = Date.now();
							//filters
							var finConditions = {};
							finConditions['appID'] = req.params.id;
							finConditions['name'] = req.body.pk;

							Promise.props({
								fin: FinancialPackage.findOneAndUpdate(
									// Condition
									finConditions,
									// Updates
									{
										// $set: {name: value}
										$set: finUpdates
									},
									// Options
									{
										// new - defaults to false, returns the modified document when true, or the original when false
										new: true,
										// runValidators - defaults to false, make sure the data fits the model before applying the update
										runValidators: true
									}
									// Callback if needed
									// { }
								).execAsync()
							})
							 .then(function (results) {
                                 ;
								})
								.catch(function (err) {
									console.error(err);
								})

								.catch(next);
							}

						}
					}
					res.locals.results = results;
                    res.locals.status = '200';
                }
                else {
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    //Project Summary  get docs for view
    getDocProjectSummaryStatus: function (req, res, next) {        
        // Use results.ProjectSummaryPackage.<whatever you need> to access the information
        Promise.props({
            //document: ProjectSummaryPackage.findById(req.params.id).lean().execAsync()
            handleToBeAssigned: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "handleToBeAssigned"}},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            handleAssigned: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "handleAssigned" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            complete: ProjectSummaryPackage.aggregate(          //Depleted, not being used
                [
                {$match: { status: "handleCompleted" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),

            handleCompleted: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "handleAssigned" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            projectUpcoming: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectUpcoming" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            projectInProgress: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectInProgress" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),

            projectGoBacks: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectGoBacks" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),

            projectCompleted: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectCompleted" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync()
        })
            .then(function(results) {

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

      // Create / Update Assessment Checklist record
  saveProjectSummaryStatus: function(req, res, next) {
    Promise.props({
      assessment: AssessmentPackage.findOneAndUpdate(
          { applicationId: req.body.applicationId },
          { $set: req.body },
          { new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
          }
      ).execAsync()
    }).then(function (results) {
      if (results.assessment !== null) {
        res.locals.status = '200';
      } else {
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);

    
  },

  // Find all users that may be assigned tasks.
  getAssignableUsers: function (req, res, next) {
    Promise.props({
      assignableUsers: UserPackage.find({ assign_tasks: true }).execAsync()

    }).then(function (results) {
      res.locals.assignableUsers = results.assignableUsers;
      next();

    }).catch(next);
  },

  // Find the wrap-up document for a project.
  getWrapUpDoc: function (req, res, next) {
    Promise.props({
      wrapUp: ProjectWrapUpPackage.find({ applicationId: ObjectId(req.params.id) }).execAsync()

    }).then(function (results) {
      if (results.wrapUp.length <= 0) {
        // Create new wrapUp and set that as new wrapUp.
        ProjectWrapUpPackage.create(
          ProjectWrapUpPackage.empty( ObjectId(req.params.id) ),
          function(err, wrapUp) {
            if (err) {
              next(err)
            } else {
              res.locals.wrapUp = wrapUp
              next()
            }
          })
      } else {
        // Just set the existing wrapUp
        res.locals.wrapUp = results.wrapUp[0]
        next();
      }

    }).catch(next);
  },

  // Create / Update Project WrapUp record
  saveProjectWrapUp: function(req, res, next) {

    Promise.props({
      projectWrapUp: ProjectWrapUpPackage.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        { $set: req.body },
        { new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).execAsync()
    }).then(function (results) {
      if (results.projectWrapUp !== null) {
        res.locals.status = '200';
      } else {
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  // Find the project plan document for a project.
  getProjectPlanDoc: function (req, res, next) {
    Promise.props({
      plan: ProjectPlanPackage.find({ applicationId: ObjectId(req.params.id) }).execAsync()

    }).then(function (results) {
      if (results.plan.length <= 0) {
        // Create new ProjectPlan and set that as new ProjectPlan.
        ProjectPlanPackage.create(
          ProjectPlanPackage.empty( ObjectId(req.params.id) ),
          function(err, plan) {
            if (err) {
              next(err)
            } else {
              res.locals.plan = plan
              next()
            }
          })
      } else {
        // Just set the existing ProjectPlan
        res.locals.plan = results.plan[0]
        next();
      }
    }).catch(next);
  },

  // Create / Update Project Plan record
  saveProjectPlan: function(req, res, next) {
    Promise.props({
      plan: ProjectPlanPackage.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        { $set: req.body },
        { new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).execAsync()
    }).then(function (results) {
      if (results.plan !== null) {
        res.locals.status = '200';
      } else {
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  getLeadtimeDefaults: function (req, res, next) {
    LeadtimeDefaults.findOne(null, function(err, lt) {
      if (typeof lt === 'object' && lt !== null) {
        res.locals.leadtime = lt
        next()

      } else {
        LeadtimeDefaults.findOneAndUpdate({}, {}, {
          'new': true,
          upsert: true,
          setDefaultsOnInsert: true
        }, function (err, lt) {
          res.locals.leadtime = lt
          next()
        })
      }
    })
  },

  setLeadtimeDefaults: function (req, res, next) {
    LeadtimeDefaults.findOneAndUpdate({}, { $set: req.body }, {
      'new': true,
      upsert: true,
      setDefaultsOnInsert: true
    }, function (err, lt) {
      res.locals.leadtime = lt
      next()
    })
  }

};
