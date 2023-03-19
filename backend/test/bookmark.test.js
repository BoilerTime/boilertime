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
    email: "mayer56@purdue.edu",
    password: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"
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

describe("POST Test bookmark", () => {
  const add = {
    class_name: "CS 18000"
  }

  var bookmarks = []

  it("API Call Get Bookmark", (done) => {
    console.log(add)
    console.log(auth)
    chai.request(app)
      .post('/api/getbookmarks')
      .send(auth)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('bookmarks');
        bookmarks = res.body.bookmarks
        done();
      });
  });

  it("API Call Add Bookmark", (done) => {
    chai.request(app)
      .post('/api/addbookmark')
      .send({...auth, ...add})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('bookmarks');
        expect(res.body.bookmarks.length).to.equal(bookmarks.length+1)
        expect(res.body.bookmarks).to.contain(add.class_name)
        done();
      });
  });

  it("API Call Remove Bookmark", (done) => {
    chai.request(app)
      .post('/api/removebookmark')
      .send({...auth, ...add})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.ownPropertyDescriptor('bookmarks');
        expect(res.body.bookmarks.length).to.equal(bookmarks.length)
        expect(res.body.bookmarks).to.eql(bookmarks)
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/getbookmarks')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/addbookmark')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it("API Call Fails without Body", (done) => {
    chai.request(app)
      .post('/api/removebookmark')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});