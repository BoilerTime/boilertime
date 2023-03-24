// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
// Configure chai
chai.use(chaiHttp);
chai.should();


describe("POST Test User Login", () => {
    
    //Data to test against
    const userLogin = {
        email: "boilertimepurdue@gmail.com",
        password: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
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