// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

var auth = {}
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
      auth = res.body;
      done();
    });
});

describe("POST Test Group Sprint 2 User Story 13", () => {

  //Data to test against
  const newGroup = {
    "group_name": "Test Group",
  }

  it("API Call Sucess Contains Group ID", (done) => {
    chai.request(app)
      .post('/api/creategroup')
      .send({...auth, ...newGroup})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body)
        expect(res.body).to.have.ownPropertyDescriptor('group_id');
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/creategroup')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});