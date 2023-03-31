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
  chai.request(app)
    .post('/api/guest')
    .end((err, res) => {
      res.should.have.status(200);
      token = res.body.accessToken;
      done();
    });
});

describe("POST Test Guest", () => {
  it("API Call for Guest to Get Bookmark", (done) => {
    chai.request(app)
      .post('/api/getbookmarks')
      .set({ "authorization": `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(418);
        done();
      });
  });

  it("API Call for Guest to Get Profile", (done) => {
    chai.request(app)
      .post('/api/get/profile')
      .set({ "authorization": `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(418);
        done();
      });
  });

  it("API Call for Guest to Join Group", (done) => {
    chai.request(app)
      .post('/api/joingroup')
      .set({ "authorization": `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(418);
        done();
      });
  });

  it("API Call for Guest to Get Groups", (done) => {
    chai.request(app)
      .post('/api/groups')
      .set({ "authorization": `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(418);
        done();
      });
  });
});
