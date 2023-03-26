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
