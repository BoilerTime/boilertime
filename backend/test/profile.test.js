// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

var auth = {}
beforeEach(function (done) {
  const userLogin = {
    email: "mayer56@purdue.edu",
    password: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"
  }
  chai.request(app)
    .post('/api/login')
    .send(userLogin)
    .end((err, res) => {
      auth = res.body;
      done();
    });
});

describe("POST Test user profile", () => {

  // Test that the status code is returned as 200
  it("API Call Returns Status 200", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .send(auth)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  //Test that all fields are correct
  it("API Call Returns All Requird Fields", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .send(auth)
      .end((err, res) => {
        //res.should.have.status(200);
        //res.text.has(user_id);
        expect(res.body).to.have.ownPropertyDescriptor('firstname');
        expect(res.body).to.have.ownPropertyDescriptor('lastname');
        expect(res.body).to.have.ownPropertyDescriptor('grad_month');
        expect(res.body).to.have.ownPropertyDescriptor('grad_year');
        expect(res.body).to.have.ownPropertyDescriptor('is_grad_student');
        done();
      });
  });


  //Test that all fields are correct
  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});