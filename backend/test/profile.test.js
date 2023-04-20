// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

var auth = {}
var token = '';
before(function (done) {
  const userLogin = {
    email: "boilertimepurdue@gmail.com",
    password: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
  }
  chai.request(app)
    .post('/api/login')
    .send(userLogin)
    .end((err, res) => {
      res.should.have.status(200);
      token = res.body.accessToken;
      auth = res.body;
      done();
    });
});

describe("POST Test Profile Sprint 3 User Story 16 (Privacy and Pairs Permissions)", () => {
  // Test that the status code is returned as 200
  it("API Call Returns Status 200", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .set({ "authorization": `Bearer ${token}` })
      .send(auth)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  var originalProfile = {}
  //Test that all fields are correct
  it("API Call To Get Initial Profile", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .set({ "authorization": `Bearer ${token}` })
      .send(auth)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('firstname');
        expect(res.body).to.have.ownPropertyDescriptor('lastname');
        expect(res.body).to.have.ownPropertyDescriptor('grad_month');
        expect(res.body).to.have.ownPropertyDescriptor('grad_year');
        expect(res.body).to.have.ownPropertyDescriptor('is_grad_student');
        originalProfile = res.body;
        done();
      });
  });

  const profile = {
    email: "boilertimepurdue@gmail.com",
    grad_month: "Janurary",
    grad_year: 2024,
    firstname: "Me",
    lastname: "You",
    is_grad_student: false,
    privacy: false,
    pairs: true
  }

  it("API Call To Update Profile", (done) => {
    chai.request(app)
      .post('/api/update/profile')
      .set({ "authorization": `Bearer ${token}` })
      .send({...auth, ...profile})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.user_id).to.equal(auth.user_id);
        done();
      });
  });

  it("Get Profile API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .set({ "authorization": `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it("Get Profile API Call Fails without Authentication", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  
  it("API Call Verify Profile Updated", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .set({ "authorization": `Bearer ${token}` })
      .send(auth)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(profile);
        done();
      });
  });

  it("API Call To Restore Profile to Original", (done) => {
    chai.request(app)
      .post('/api/update/profile')
      .set({ "authorization": `Bearer ${token}` })
      .send({...auth, ...originalProfile})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.user_id).to.equal(auth.user_id);
        done();
      });
  });
});
