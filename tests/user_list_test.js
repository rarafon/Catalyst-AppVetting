var server = require("../app.js");
var chai = require("chai");
var chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

require('dotenv').config({ path: require('find-config')('.env') });

describe("Routes Testing", () => {
  describe("Test without loggin in", () => {
    it("it should redirect & not get userslist without logging in", (done) => {
      chai.request(server)
        .get('/user/userList')
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res).to.redirectTo(/\/user\/login/);
          done();
        });    
      }
    );

    it("it should redirect & not get userslist without logging in", (done) => {
      chai.request(server)
        .get('/user/register')
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res).to.redirectTo(/\/user\/login/);
          done();
        });    
      }
    );
  });

  describe("Test with logging in", () => {
    var agent = chai.request.agent(server);
    
    it("log in with wrong password redirects back to login", (done) => {

      var username = process.env.CATALYST_USER_EMAIL,
          password = process.env.CATALYST_USER_PASSWORD;
      agent.post("/user/login")
        .set('content-type', 'application/x-www-form-urlencoded')
        .send( { email: username, password: "wrongpassword" })
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res).to.redirectTo(/\/user\/login/);
          done();
        });
    });

    it("userlist redirects without logging in", (done) => {
      agent.get('/user/userList')
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res).to.redirectTo(/\/user\/login/);
          done();
        });    
      }
    );

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

    it("should get userslist after logging in", (done) => {
      agent.get('/user/userList')
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res).to.not.redirect;
          done();
        });    
      }
    );

    it("should get userslist after logging in", (done) => {
      agent.get('/user/register')
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res).to.not.redirect;
          done();
        });    
      }
    );

    it("should logout", (done) => {
      agent.get('/user/logout')
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res).to.redirectTo(/\/user\/login/);
          done();
        });    
      }
    );
  });
});