var express = require('express');

var router = express.Router();

var helper = require("../../service/helper");

var CareApplicant = require('../../models/care/careApplicant');
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

router.get('/application', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/application", context);
    }
  );
});


router.post('/application', async function(req, res) {
  if (application_service.check_care_application(req.body)) {
      await application_service.create_care_applicant(req.body)
      res.status(200).end(); // OK creation
  } else
    res.status(404).end(); // Missing fields
});

router.get('/view_apps', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/application", context);
    }
  );
});

module.exports = router;