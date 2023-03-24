// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe("POST Test BoilerGrades", () => {

  //Data to test against
  const turkstra = {
    prof_name: "Jeffrey A. Turkstra",
    class_name: "CS30700"
  }

  const invalid = {
    prof_name: "Joshua J. Yang",
    class_name: "CS30700"
  }

  const invalid2 = {
    prof_name: "Jeffrey A. Turkstra",
    class_name: "CS 30700"
  }

  const turkstraExpected307 = {
    "averageGPA": 3.41
  }

  const turkstraExpected = {
    "overall_gpa": 3.07
  }

  //Test getgpa
  it("API Call BoilerGrades on Tursktra for CS 307", (done) => {
    chai.request(app)
      .post('/api/getgpa')
      .send(turkstra)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(turkstraExpected307)
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/getgpa')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("API Call Fails with Invalid Professor", (done) => {
    chai.request(app)
      .post('/api/getgpa')
      .send(invalid)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("API Call Fails with Invalid Class", (done) => {
    chai.request(app)
      .post('/api/getgpa')
      .send(invalid2)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  //Test overallgpa
  it("API Call BoilerGrades on Tursktra for Overall GPA", (done) => {
    chai.request(app)
      .post('/api/getoverall_gpa')
      .send(turkstra)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(turkstraExpected)
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/getoverall_gpa')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("API Call Fails with Invalid Professor", (done) => {
    chai.request(app)
      .post('/api/getoverall_gpa')
      .send(invalid)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

});