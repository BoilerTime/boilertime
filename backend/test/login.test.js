// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("POST Test a user login", () => {
    
    //Data to test against
    const userLogin = {
        email: "mayer56@purdue.edu",
        password: "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5"
    }

    // Test that the status code is returned as 200
    it("API Call Returns Status 200", (done) => {
        chai.request(app)
            .post('/api/login')
            .send(userLogin)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    
    //Test that all fields are correct
    it("API Call Returns All Requird Fields", (done) => {
        chai.request(app)
            .post('/api/login')
            .send(userLogin)
            .end((err, res) => {
                //res.should.have.status(200);
                //res.text.has(user_id);
                expect(res.body).to.have.ownPropertyDescriptor('user_id');
                expect(res.body).to.have.ownPropertyDescriptor('refreshToken');
                expect(res.body).to.have.ownPropertyDescriptor('accessToken');
                done();
            });
    });

        
    //Test that all fields are correct
    it("API Call Fails without Body", (done) => {
        chai.request(app)
            .post('/api/login')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
});