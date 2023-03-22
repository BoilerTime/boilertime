// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe("POST Test Building", () => {

  //Data to test against
  const haas = {
    room: "HAAS G050"
  }

  const invalid = {
    room: "BOILERTIME"
  }

  const hassExpected = {
    building: "Felix Haas Hall"
  }

  //Test getgpa
  it("API Call Building", (done) => {
    chai.request(app)
      .post('/api/building')
      .send(haas)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(hassExpected)
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/building')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("API Call Fails with Invalid Building", (done) => {
    chai.request(app)
      .post('/api/building')
      .send(invalid)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

});