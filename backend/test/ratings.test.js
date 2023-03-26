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
var courseRating = {
  "course": "CS30700",
  "prequisite_strictness": 2.1,
  "pace": 3.2,
  "depth": 2.3,
  "explanation": "Test"
};

var expectedCourseRating = {"0": {
  "course": "CS30700",
  "rating": [
    2.1,
    3.2,
    2.3
  ],
  "timestamp": "Sat Mar 25 2023",
  "flag_count": 0,
  "explanation": "Test"
  }
}

var classroomRating = {
  "classroom": "LWSNB160",
  "access_conv": 5.0,
  "seating_quality": 5.0,
  "technology_avail": 5.0,
  "explanation": "Test"
}

var expectedClassroomRating = {"0": {
  "classroom": "LWSNB160",
  "rating": [
    5.0,
    5.0,
    5.0
  ],
  "timestamp": "Sat Mar 25 2023",
  "flag_count": 0,
  "explanation": "Test"
  }
}


var taRating = {
  "ta": "Mahad Faruqi",
  "grading_fairness": 5.0,
  "question_answering": 5.0,
  "responsiveness": 0.0,
  "explanation": "Test"
}


var expectedTARating = {"0": {
  "ta": "Mahad Faruqi",
  "rating": [
    5.0,
    5.0,
    0.0
  ],
  "timestamp": "Sat Mar 25 2023",
  "flag_count": 0,
  "explanation": "Test"
  }
}

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
      token = res.body.accessToken;
      auth = {...res.body};
      done();
    });
});

describe("POST Test Ratings", () => {


  it("API Call Add Course Rating", (done) => {
    console.log(auth)
    chai.request(app)
      .post('/api/add/ratings/courses')
      .set({ "authorization": `Bearer ${token}` })
      .send({ user_id: auth.user_id, ...courseRating}) 
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  });

  it("API Call To Get User Course Ratings", (done) => {
    chai.request(app)
      .post('/api/get/user_ratings/courses')
      .set({ "authorization": `Bearer ${token}` })
      .send({user_id: auth.user_id})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(expectedCourseRating);
        done();
      });
  });

  it("API Call To Delete User Course Ratings", (done) => {
    chai.request(app)
      .post('/api/delete/ratings/courses')
      .set({ "authorization": `Bearer ${token}` })
      .send({user_id: auth.user_id, course: courseRating.course})
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("API Call Add Classroom Rating", (done) => {
    console.log(auth)
    chai.request(app)
      .post('/api/add/ratings/classrooms')
      .set({ "authorization": `Bearer ${token}` })
      .send({ user_id: auth.user_id, ...classroomRating}) 
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  });

  it("API Call To Get User Classroom Ratings", (done) => {
    chai.request(app)
      .post('/api/get/user_ratings/classrooms')
      .set({ "authorization": `Bearer ${token}` })
      .send({user_id: auth.user_id})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(expectedClassroomRating);
        done();
      });
  });

  it("API Call To Delete User Classroom Ratings", (done) => {
    chai.request(app)
      .post('/api/delete/ratings/classrooms')
      .set({ "authorization": `Bearer ${token}` })
      .send({user_id: auth.user_id, classroom: classroomRating.classroom})
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("API Call Add TA Rating", (done) => {
    console.log(auth)
    chai.request(app)
      .post('/api/add/ratings/tas')
      .set({ "authorization": `Bearer ${token}` })
      .send({ user_id: auth.user_id, ...taRating}) 
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  });

  it("API Call To Get User TA Ratings", (done) => {
    chai.request(app)
      .post('/api/get/user_ratings/tas')
      .set({ "authorization": `Bearer ${token}` })
      .send({user_id: auth.user_id})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.eql(expectedTARating);
        done();
      });
  });

  it("API Call To Delete User TA Ratings", (done) => {
    chai.request(app)
      .post('/api/delete/ratings/tas')
      .set({ "authorization": `Bearer ${token}` })
      .send({user_id: auth.user_id, ta: taRating.ta})
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
