var express = require('express');

var router = express.Router();

var helper = require("../../service/helper");

var CareApplicant = require('../../models/care/careApplicant');
var CareService = require('../../models/care/careService');
// var CareContact = require('../../models/care/careContact');

var application_service = require('../../service/care/application.js');

// router.get('/', helper.isLoggedIn, function(req, res) {
  router.get('/', function(req, res) {
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/index", context);
    }
  );
});

// View Page for Applicant Data
router.get('/view_application/:application_id',  function(req, res){
  helper.create_user_context(req).then(
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      // var application = await application_service.get_applicant(application_id);
      res.render("care/application_page", context);
    }
  );
});


// Edit Applicant Data
router.post('/view_application/:application_id', async function(req, res) {
  var application_id = req.params.application_id;
  await application_service.update_application(application_id, req.body);
  res.status(200).end();
});

router.get('/application/:application_id',  function(req, res){
  helper.create_user_context(req).then(
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      var application = await application_service.get_applicant(application_id);
      res.status(200).json(application);
    }
  );
});

router.get('/application', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/application_form", context);
    }
  );
});

router.get('/view_applications', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      context.applicants = [];
      var app_obj;
      CareApplicant.find({}, function(err, applicants) {
        applicants.forEach(function(applicant) {
          app_obj = {};
          app_obj.id = applicant._id
          app_obj.application_link = "./view_application/" + applicant._id;
          app_obj.services_link = "./view_services/" + applicant._id;
          context.applicants.push(app_obj);
        });
        
        res.render("care/applications", context);
      });
    }
  );
});

router.post('/application', async function(req, res) {
  if (application_service.check_care_application(req.body)) {
      await application_service.create_care_applicant(req.body)
      res.status(201).end(); // OK creation
  } else
    res.status(404).end(); // Missing fields
});

// Services Page
router.get('/view_services/:applicant_id', function(req, res) {
  helper.create_user_context(req).then(
    (context) => {
      var applicant_id = req.params.applicant_id
      context.applicant_id = applicant_id;
      
      context.add_service_url ="/carenetwork/add_service/" + applicant_id;
      res.render("care/services_page.hbs", context);
    }
  );
});

// Add Service Page
router.get('/add_service/:applicant_id', function(req, res) {
  helper.create_user_context(req).then(
    (context) => {
      var applicant_id = req.params.applicant_id
      context.applicant_id = applicant_id;
      res.render("care/add_service.hbs", context);
    }
  );
});

module.exports = router;