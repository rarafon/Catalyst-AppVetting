var server = require("../app.js");
var api = require("../controllers/api.js");

var chai = require("chai");
var chaiHttp = require("chai-http");

var DocumentPackage = require('../models/documentPackage');
var HighlightPackage = require('../models/highlightPackage');
var FinancialPackage = require('../models/finPackage');

chai.use(chaiHttp);
chai.should();

require('dotenv').config({ path: require('find-config')('.env') });

describe("api.js", () => {
  describe("getAllDocuments", () => {
    var agent = chai.request.agent(server);
    it("should have object in res.locals.result", (done) => {
      function next(req, res) {
        var doc = res_result.locals.results;
        
        chai.expect(doc).to.exist;
        done();
      }
      var res_result = {locals:{}};
      
      api.getAllDocuments(null, res_result, next);
    });

    it("should have application object in application exist", (done) => {
      
      function next(req, res) {
        var doc = res_result.locals.results,
            apps = doc.application;
        for (var i=0; i<apps.length; i++) {
          chai.expect(apps[i].application).to.exist;
        }
        done();
      }
      var res_result = {locals:{}};
      
      api.getAllDocuments(null, res_result, next);
    });
  });

  describe("postDocument", () => {
    var agent = chai.request.agent(server);
    var doc_id;
    it("Create a document and make sure it exist", (done) => {
      function next(req, res) {
        chai.expect(req.status).to.eq(200);
        done();
      }
      var res_result = {
        send: next,
        locals:{}
      },
          req_proto = {
            body: {
              count: 0,
              application: {
                name: {
                  first: "QQXDAFB",
                  last: "last",
                }
              },
              signature: {
                client_date: new Date(),
              }
            },
          }
      
      api.postDocument(req_proto, res_result, next);
    });

    it("Check that documents exist", async () => {
      var docs = await DocumentPackage.find({"application.name.first": "QQXDAFB"});

      chai.expect(docs.length).to.gte(1);

      doc_id = docs[0]._id;;
    });

    it("login with correct account information", (done) => {
      var username = process.env.CATALYST_USER_EMAIL,
          password = process.env.CATALYST_USER_PASSWORD;
      agent.post("/user/login")
        .set('content-type', 'application/x-www-form-urlencoded')
        .send( { email: username, password: password })
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(200);
          chai.expect(res).to.not.redirectTo(/\/user\/login/);
          done();
        });
    });

    it("should edit the name of the document to /edit/name/", async () => {
      var new_data = {
        "value[first]": "QQXDAFB",
        "value[middle]": "B",
        "value[last]": "C"
      };
      agent.post("/edit/name/" + doc_id)
        .send( new_data )
        .end((err, res) => {
          res.should.have.status(200);
        });
    });

    it("should have the new names", async () => {
      var doc = await DocumentPackage.findById(doc_id);
      console.log(doc);
      chai.expect(doc.application.name.first).to.eq("QQXDAFB");
      chai.expect(doc.application.name.middle).to.eq("B");
      chai.expect(doc.application.name.last).to.eq("C");
    });

    it("Delete the documents", async () => {
      var docs = await DocumentPackage.find({"application.name.first": "QQXDAFB"});
      var doc;
      for (var i =0; i< docs.length; i++) {
        doc = docs[i];
        await HighlightPackage.deleteMany({documentPackage: doc._id,});
        await FinancialPackage.deleteMany({appID: doc._id,});
      }
      await DocumentPackage.deleteMany({"application.name.first": "QQXDAFB"});
      chai.expect(1).to.eq(1);
    });

    it("Check that no documents exist", async () => {
      var docs = await DocumentPackage.find({"application.name.first": "QQXDAFB"});
      
      chai.expect(docs.length).to.eq(0);
    });
  });

  describe("getDocumentById", () => {
    var agent = chai.request.agent(server);
    it("should have object in res.locals.result", (done) => {
      function next(req, res) {
        var doc = res_result.locals.results;
        
        chai.expect(doc).to.exist;
        done();
      }
      var res_result = {locals:{}};
      
      api.getAllDocuments(null, res_result, next);
    });

    it("should have application object in application exist", (done) => {
      function next(req, res) {
        var doc = res_result.locals.results,
            apps = doc.application;
        for (var i=0; i<apps.length; i++) {
          chai.expect(apps[i].application).to.exist;
        }
        done();
      }
      var res_result = {locals:{}};
      
      api.getAllDocuments(null, res_result, next);
    });
  });
});