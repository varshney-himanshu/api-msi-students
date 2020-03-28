const app = require("../../../server");
const assert = require("chai").assert;
const request = require("supertest")(app);

describe("POST /user/register", function() {
  it("should response with json object with bunch of errors when empty object is recieved", function(done) {
    request
      .post("/user/register")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it("should return an error if name field is missing from the body", function(done) {
    const testData = {
      name: "",
      password: "abcdefg",
      password2: "abcdefg",
      email: "test@test.com",
      role: "testRole",
      department: "test"
    };

    request
      .post("/user/register")
      .send(testData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        assert.ok(res.body.name === "Name field is required");
        done();
      });
  });

  it("should return a object and status 200 when user is successfully added or 409 when the user already exist", function(done) {
    const testData = {
      name: "test2",
      password: "abcdefg",
      password2: "abcdefg",
      email: "test6@test.com",
      role: "testRole",
      department: "test"
    };

    request
      .post("/user/register")
      .send(testData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .timeout(60000)
      .end((err, res) => {
        if (err) throw err;
        assert.ok(res.status === 200 || res.status === 409);
        done();
      });
  });
});
