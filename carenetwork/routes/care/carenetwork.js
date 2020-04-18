var express = require('express');

var router = express.Router();

var helper = require("../../service/helper");

router.get('/', helper.isLoggedIn, function(req, res) {
  var context = {"carenetwork": true};
  res.render("care/index", context);
});

router.get('/application', helper.isLoggedIn, function(req, res){
  var context = {"carenetwork": true};
  res.render("care/application", context);
});

module.exports = router;