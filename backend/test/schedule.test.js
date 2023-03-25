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

describe("POST Test Group Sprint 2 User Story 8", () => {

  it("API Call Sucess Get Previously Submited Classes", (done) => {
    chai.request(app)
      .post('/api/getclasses')
      .send({...auth})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body)
        expect(res.body).to.have.ownPropertyDescriptor('optional_classes');
        expect(res.body).to.have.ownPropertyDescriptor('required_classes');
        expect(res.body).to.have.ownPropertyDescriptor('personal_preferences');
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/getclasses')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});