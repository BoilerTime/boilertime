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
      token = res.body.accessToken;
      auth = res.body;
      done();
    });
});

describe("POST Test Schedule Sprint 2 User Story 8", () => {

  it("API Call Success Get Previously Submited Classes", (done) => {
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

  it("API Call To Get All User Schedules", (done) => {
    chai.request(app)
      .post('/api/get/user_schedules')
      .set({ "authorization": `Bearer ${token}` })
      .send({...auth})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body)
        expect(res.body[0]).to.have.ownPropertyDescriptor('optional_classes');
        expect(res.body[0]).to.have.ownPropertyDescriptor('required_classes');
        expect(res.body[0]).to.have.ownPropertyDescriptor('personal_preferences');
        expect(res.body[res.body.length - 1]).to.have.ownPropertyDescriptor('num_schedules');
        done();
      });
  });
});
