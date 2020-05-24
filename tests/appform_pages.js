var server = require("../app.js");
var chai = require("chai");
var chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

require('dotenv').config({ path: require('find-config')('.env') });

describe("Appform Routing Pages Testing", () => {

  describe("Test the pages", () => {
    var agent = chai.request.agent(server);
    
    it("should go to /application/add", (done) => {
      agent.get("/application/add")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should go to /application/success", (done) => {
      agent.get('/application/add')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });    
      }
    );
  });
});