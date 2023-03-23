// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

var auth = {}

const userLogin = {
  email: "boilertimepurdue@gmail.com",
  password: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}

before(function (done) {
  chai.request(app)
    .post('/api/login')
    .send(userLogin)
    .end((err, res) => {
      res.should.have.status(200);
      auth = res.body;
      done();
    });
});

describe("POST Test Forgot and Reset Password", () => {
  // Test that the status code is returned as 200
  it("API Forgot Password", (done) => {
    chai.request(app)
      .post('/api/forgotpassword')
      .send(userLogin)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('user_id');
        expect(res.body).to.have.ownPropertyDescriptor('email');
        auth.user_id = res.body.user_id;
        done();
      });
  });

  const newpassword = {
    password: "password",
  }

  it("API Change Password", (done) => {
    chai.request(app)
      .post('/api/resetpassword')
      .send({...newpassword, ...auth})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(newpassword);
        done();
      });
  });

  it("API Call Forgot Password Empty Return Error", (done) => {
    chai.request(app)
      .post('/api/forgotpassword')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it("API Call Reset Password Empty Return Error", (done) => {
    chai.request(app)
      .post('/api/resetpassword')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it("API Call To Restore Password", (done) => {
    chai.request(app)
      .post('/api/resetpassword')
      .send({...auth, ...userLogin})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.password).to.equal(userLogin.password);
        done();
      });
  });
});