// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

var darkMode = false;
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

describe("POST Test Dark Mode", () => {

  it("API Call to Get Dark Mode", (done) => {
    chai.request(app)
      .post('/api/get/darkmode')
      .set({ "authorization": `Bearer ${token}` })
      .send(auth)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('dark_mode');
        darkMode = res.body.dark_mode;
        done();
      });
  });

  it("API Call to Set Dark Mode", (done) => {
    chai.request(app)
      .post('/api/set/darkmode')
      .set({ "authorization": `Bearer ${token}` })
      .send({...auth, dark_mode: !darkMode})
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("API Call to Verify Dark Mode Changed", (done) => {
    chai.request(app)
      .post('/api/get/darkmode')
      .set({ "authorization": `Bearer ${token}` })
      .send(auth)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('dark_mode');
        expect(res.body.dark_mode).to.equal(!darkMode);
        done();
      });
  });

  it("API Call to Change Dark Mode Back to Original", (done) => {
    chai.request(app)
      .post('/api/set/darkmode')
      .set({ "authorization": `Bearer ${token}` })
      .send({...auth, dark_mode: darkMode})
      .end((err, res) => {
        console.log(res.body + " < res body");
        res.should.have.status(200);
        done();
      });
  });
});
