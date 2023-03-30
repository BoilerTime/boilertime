// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

var auth = {}
var auth2 = {}
before(function (done) {
  const userLogin = {
    email: "boilertimepurdue@gmail.com",
    password: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
  }
  const userLogin2 = {
    email: "jjyang@purdue.edu",
    password: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
  }
  chai.request(app)
    .post('/api/login')
    .send(userLogin)
    .end((err, res) => {
      res.should.have.status(200);
      auth = res.body;
    });
  chai.request(app)
    .post('/api/login')
    .send(userLogin2)
    .end((err, res) => {
      res.should.have.status(200);
      auth2 = res.body;
      done();
    });
});

describe("POST Test Group Sprint 2 User Story 13", () => {

  //Data to test against
  const newGroup = {
    "group_name": "Test Group",
  }
  var group_id = {};
  it("API Call Sucess Contains Group ID", (done) => {
    chai.request(app)
      .post('/api/creategroup')
      .send({...auth, ...newGroup})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body)
        expect(res.body).to.have.ownPropertyDescriptor('group_id');
        group_id = res.body;
        done();
      });
  });

  it("API Call Join Group", (done) => {
    chai.request(app)
      .post('/api/joingroup')
      .send({...auth2, ...group_id})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('group_name');
        expect(res.body.group_name).to.equal(newGroup.group_name);
        done();
      });
  });

  it("API Call Get Groups", (done) => {
    chai.request(app)
      .post('/api/groups')
      .send({...auth})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('groups');
        done();
      });
  });

  it("API Call Get Group Just Created", (done) => {
    chai.request(app)
      .post('/api/group')
      .send({...auth, ...group_id})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('group_name');
        expect(res.body.group_name).to.equal(newGroup.group_name);
        expect(res.body.member_names).to.eql(["boilertimepurdue@gmail.com", "jjyang@purdue.edu"]);
        expect(res.body.member_ids).to.eql([auth.user_id, auth2.user_id]);
        done();
      });
  });


  it("API Call Fails with Duplicate Member from Owner", (done) => {
    chai.request(app)
      .post('/api/joingroup')
      .send({...auth, ...group_id})
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });

  it("API Call Fails with Duplicate Member from Member", (done) => {
    chai.request(app)
      .post('/api/joingroup')
      .send({...auth2, ...group_id})
      .end((err, res) => {
        res.should.have.status(409);
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