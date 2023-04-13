// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe("POST Test Create User", () => {

  //Data to test against
  const newUser = {
    firstname: "Test",
    lastname: "User",
    email: "abc@purdue.edu",
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

  it("API Create User", (done) => {
    chai.request(app)
      .post('/api/createuser')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('user_id');
        expect(res.body).to.have.ownPropertyDescriptor('firstname');
        expect(res.body).to.have.ownPropertyDescriptor('email');
        expect(res.body.firstname).to.equal('Test');
        expect(res.body.email).to.equal('abc@purdue.edu');
        auth = res.body;
        done();
      });
  });

  it("API Verify User", (done) => {
    chai.request(app)
      .post('/api/verifyaccount')
      .send({userID: auth.user_id})
      .end((err, res) => {
        console.log(auth)
        res.should.have.status(200);
        done();
      });
  });

  it("API Login User", (done) => {
    chai.request(app)
    .post('/api/login')
    .send(newUser)
    .end((err, res) => {
      res.should.have.status(200);
      auth = res.body;
      done();
    });
  });

  it("API Delete User", (done) => {
    chai.request(app)
      .post('/api/deleteuser')
      .set({ "authorization": `Bearer ${auth.accessToken}` })
      .send(auth)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

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
