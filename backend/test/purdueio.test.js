// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe("POST Test PurdueIOs", () => {

  //Data to test against
  const isFull =  [
    false,
    true,
    false
  ]

  const data = {
    "subject": "CS",
    "number": "18200",
    "sectionIDs": [
      "ff5a739d-432b-4591-bc19-60553fc82547",
      "68478747-fb88-423a-85bd-02d454c8bc0c",
      "af6db0ed-1566-432d-ad60-17e8f34a0201"
    ]
  }


  it("API Call Purdue.io for CS 18200 Spring 2023", (done) => {
    chai.request(app)
      .post('/api/optimizer/isfull')
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(isFull);
        done();
      });
  });
});
