// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
const dayjs = require('dayjs');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
// Configure chai
chai.use(chaiHttp);
chai.should();

var auth = {}
var token = '';
var numRatings = 0;
var timestamp = Timestamp.now();
var date = dayjs.unix(timestamp.seconds + timestamp.nanoseconds/1000000).$d;
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
  "timestamp": date.toDateString(),
  "flag_count": 0,
  "explanation": "Test"
  }
}

var expectedCourseRating2 = {
  "rating": [
    2.1,
    3.2,
    2.3
  ],
  "timestamp": date.toDateString(),
  "flag_count": 0,
  "explanation": "Test"
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
  "timestamp": date.toDateString(),
  "flag_count": 0,
  "explanation": "Test"
  }
}

var expectedClassroomRating2 = {
  "rating": [
    5.0,
    5.0,
    5.0
  ],
  "timestamp": date.toDateString(),
  "flag_count": 0,
  "explanation": "Test"
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
  "timestamp": date.toDateString(),
  "flag_count": 0,
  "explanation": "Test"
  }
}

var expectedTARating2 = {
  "rating": [
    5.0,
    5.0,
    0.0
  ],
  "timestamp": date.toDateString(),
  "flag_count": 0,
  "explanation": "Test"
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

describe("POST Test Ratings Sprint 2 User Story 3, 4, 5, 6, 10", () => {


  it("API Call Add Course Rating", (done) => {
    chai.request(app)
      .post('/api/add/ratings/courses')
      .set({ "authorization": `Bearer ${token}` })
      .send({ user_id: auth.user_id, ...courseRating}) 
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  });

  /*
  it("API Call to Get Number of Course Ratings", (done) => {
    chai.request(app)
      .post('/api/get/num_ratings')
      .end((err, res) => {
        res.should.have.status(200);
        numRatings = res.body.num_ratings; 
        done();
      })
  });
  */

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

  it("API Call To Get Course Ratings After Add", (done) => {
    chai.request(app)
      .post('/api/get/course_ratings/courses')
      .set({ "authorization": `Bearer ${token}` })
      .send({course_name : courseRating.course})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body);
        console.log(expectedCourseRating2);
        expect(res.body).to.deep.include(expectedCourseRating2);
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

  it("API Call To Get Course Ratings After Delete", (done) => {
    chai.request(app)
      .post('/api/get/course_ratings/courses')
      .set({ "authorization": `Bearer ${token}` })
      .send({course_name : courseRating.course})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body);
        console.log(expectedCourseRating2);
        expect(res.body).to.not.deep.include(expectedCourseRating2);
        done();
      });
  });

  /*
  it("API Call to Get Number of Course Ratings After Deleting a Rating", (done) => {
    chai.request(app)
      .post('/api/get/num_ratings')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.num_ratings).to.equal(numRatings - 1);
        done();
      })
  });
  */

  it("API Call Add Classroom Rating", (done) => {
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

  it("API Call To Get Classroom Ratings After Add", (done) => {
    chai.request(app)
      .post('/api/get/classroom_ratings/classrooms')
      .set({ "authorization": `Bearer ${token}` })
      .send({classroom : classroomRating.classroom})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body);
        console.log(expectedClassroomRating2);
        expect(res.body).to.deep.include(expectedClassroomRating2);
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

  it("API Call To Get Classroom Ratings After Delete", (done) => {
    chai.request(app)
      .post('/api/get/classroom_ratings/classrooms')
      .set({ "authorization": `Bearer ${token}` })
      .send({classroom : classroomRating.classroom})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body);
        console.log(expectedClassroomRating2);
        expect(res.body).to.not.deep.include(expectedClassroomRating2);
        done();
      });
  });

  it("API Call Add TA Rating", (done) => {
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

  it("API Call To Get TA Ratings After Add", (done) => {
    chai.request(app)
      .post('/api/get/ta_ratings/tas')
      .set({ "authorization": `Bearer ${token}` })
      .send({ta : taRating.ta})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body);
        console.log(expectedTARating2);
        expect(res.body).to.deep.include(expectedTARating2);
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

  it("API Call To Get TA Ratings After Delete", (done) => {
    chai.request(app)
      .post('/api/get/ta_ratings/tas')
      .set({ "authorization": `Bearer ${token}` })
      .send({ta : taRating.ta})
      .end((err, res) => {
        res.should.have.status(200);
        console.log(res.body);
        console.log(expectedTARating2);
        expect(res.body).to.not.deep.include(expectedTARating2);
        done();
      });
  });
});
