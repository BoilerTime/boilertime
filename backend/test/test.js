// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("GET API Index Page", () => {
    // Test to get all students record
    it("Index returns status 200", (done) => {
        chai.request(app)
            .get('/api')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    // Test to get all students record
    it("API Text Correct", (done) => {
        chai.request(app)
            .get('/api')
            .end((err, res) => {
                //res.should.have.status(200);
                res.text.should.equal('API live!');
                done();
            });
    });
});