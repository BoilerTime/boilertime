// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe("POST Test register", () => {

  //Data to test against
  const newUser = {
    firstname: "Test",
    lastname: "User",
    email: "jjyang@purdue.edu",
    password: "password",
    gradmonth: "March",
    gradyear: "2024",
    isGraduateStudent: "false"
  }

  const badEmail = {
    firstname: "Test",
    lastname: "User",
    email: "jjyang@gmail.edu",
    password: "password",
    gradmonth: "March",
    gradyear: "2024",
    isGraduateStudent: "false"
  }

  const alreadyExists = {
    firstname: "Test",
    lastname: "User",
    email: "mayer56@purdue.edu",
    password: "password",
    gradmonth: "March",
    gradyear: "2024",
    isGraduateStudent: "false"
  }

  var auth = {};

  //Test that all fields are correct
  /*
  it("API Call Returns All Requird Fields", (done) => {
    chai.request(app)
      .post('/api/createuser')
      .send(newUser)
      .end((err, res) => {
        //res.should.have.status(200);
        //res.text.has(user_id);
        expect(res.body).to.have.ownPropertyDescriptor('user_id');
        expect(res.body).to.have.ownPropertyDescriptor('firstname');
        expect(res.body).to.have.ownPropertyDescriptor('email');
        expect(res.body.firstname).to.equal('Test');
        expect(res.body.email).to.equal('jjyang@purdue.edu');
        auth = res.body;
        done();
      });
  });
  */

  //TODO: Verify Account (valid and invalid)
  
  //TODO: Login

  it("API Call Fails without Valid email", (done) => {
    chai.request(app)
      .post('/api/createuser')
      .send(badEmail)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it("API Call Fails with Existing User", (done) => {
    chai.request(app)
      .post('/api/createuser')
      .send(alreadyExists)
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });


  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/createuser')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});