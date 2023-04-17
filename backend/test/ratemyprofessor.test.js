// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe("POST Test RateMyProfessor", () => {

  //Data to test against
  const turkstra = {
    prof_name: "Jeffrey A. Turkstra"
  }

  const invalid = {
    prof_name: "AAAAAA AAAAAA"
  }

  const invalid2 = {
    prof_name: ""
  }

  const turkstraExpected = {
    "avgDifficulty": 4.3,
    "avgRating": 3.8,
    "department": "Computer Science",
    "firstName": "Jeff",
    "id": "VGVhY2hlci0yMjMxNDk1",
    "lastName": "Turkstra",
    "legacyId": 2231495,
    "numRatings": 126,
    "school": {
      "city": "",
      "id": "U2Nob29sLTc4Mw==",
      "name": "Purdue University - West Lafayette",
      "state": ""
    },
    "wouldTakeAgainPercent": 51.2397
  }

  //Test that all fields are correct
  it("API Call Rate My Professor on Tursktra", (done) => {
    chai.request(app)
      .post('/api/ratemyprofessor')
      .send(turkstra)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(turkstraExpected)
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/ratemyprofessor')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it("API Call Fails with Invalid Professor", (done) => {
    chai.request(app)
      .post('/api/ratemyprofessor')
      .send(invalid)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it("API Call Fails with Empty Prof Name", (done) => {
    chai.request(app)
      .post('/api/ratemyprofessor')
      .send(invalid2)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});