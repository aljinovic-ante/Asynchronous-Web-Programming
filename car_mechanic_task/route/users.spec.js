const { expect } = require("chai");
const userRepo = require("../repo/users");
const { getAuthHeadersForUserId } = require("../apiTest");

describe("Users Routes", function () {
  describe("POST /users", function () {
    it("should create a new user", async function () {
      const newUser = {
        email: "test@example.com",
        password: "password123",
        fullname: "Test User",
        role: "customer",
      };
      const resp = await global.api.post("/users").send(newUser).expect(200);
      expect(resp.body).to.have.property("email", newUser.email);
      expect(resp.body).to.have.property("fullname", newUser.fullname);
    });

    it("should return an error when adding a user with the same email", async function () {
      const duplicateUser = {
        email: "test@example.com",
        password: "newpassword123",
        fullname: "Another User",
        role: "owner",
      };

      const resp = await global.api
        .post("/users")
        .send(duplicateUser)
        .expect(409);

      expect(resp.body).to.have.property("message");
      expect(resp.body.message).to.equal("Email is already in use.");
    });
  });

  describe("GET /users", function () {
    it("should fetch all users", async function () {
      const resp = await global.api
        .get("/users")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length).to.be.greaterThan(0);
    });
  });

  describe("GET /users/:userId", function () {
    let user;

    before(async function () {
      const newUser = {
        email: "123123test@example.com",
        password: "1231231password123",
        fullname: "Test User",
        role: "customer",
      };

      const resp = await global.api.post("/users").send(newUser).expect(200);
      user = resp.body;
    });

    it("should fetch a single user by ID", async function () {
      const resp = await global.api.get(`/users/${user.id}`).expect(200);

      expect(resp.body).to.have.property("id", user.id);
      expect(resp.body).to.have.property("email");
      expect(resp.body).to.have.property("fullname", "Test User");
      expect(resp.body).to.have.property("role", "customer");
    });

    it("should return 404 if the user is not found", async function () {
      const userId = 99999;
      const resp = await global.api.get(`/users/${userId}`).expect(404);

      expect(resp.body).to.have.property("message", "User not found");
    });
  });

  describe("PUT /users/:userId", function () {
    let user;

    before(async function () {
      const updateuser = {
        email: "update@example.com",
        password: "1231231password123",
        fullname: "Test User",
        role: "customer",
      };

      const resp = await global.api.post("/users").send(updateuser).expect(200);
      user = resp.body;
    });
    it("should update a user by ID", async function () {
      const updatedData = { fullname: "Updated User" };

      const resp = await global.api
        .put(`/users/${user.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(updatedData)
        .expect(200);

      expect(resp.body).to.have.property("fullname", updatedData.fullname);
    });

    it("should return 404 if the user is not found", async function () {
      const userId = 99999;
      const updatedData = { fullname: "Non-existent User" };

      const resp = await global.api
        .put(`/users/${userId}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(updatedData)
        .expect(404);

      expect(resp.body).to.have.property("message", "User not found");
    });
  });

  describe("DELETE /users/:userId", function () {
    let user;

    before(async function () {
      const deleteuser = {
        email: "deleteuser@example.com",
        password: "1231231password123",
        fullname: "Test User",
        role: "customer",
      };

      const resp = await global.api.post("/users").send(deleteuser).expect(200);
      user = resp.body;
    });

    it("should delete a user by ID", async function () {
      await global.api
        .delete(`/users/${user.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(204);
    });

    it("should return 404 if the user is not found", async function () {
      const userId = 99999;

      const resp = await global.api
        .delete(`/users/${userId}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(404);

      expect(resp.body).to.have.property("message", "User not found");
    });
  });

  describe("POST /login", function () {
    before(async function () {
      const newUser = {
        email: "login@example.com",
        password: "login12345",
        fullname: "Test User",
        role: "customer",
      };

      const resp = await global.api.post("/users").send(newUser).expect(200);
      user = resp.body;
    });

    it("should login a user with valid credentials", async function () {
      const credentials = {
        email: "login@example.com",
        password: "login12345",
      };

      const resp = await global.api
        .post("/login")
        .send(credentials)
        .expect(200);

      expect(resp.body).to.have.property("token");
    });

    it("should return 401 for invalid credentials", async function () {
      const credentials = {
        email: "login@example.com",
        password: "wrongpassword",
      };

      const resp = await global.api
        .post("/login")
        .send(credentials)
        .expect(401);

      expect(resp.body).to.have.property("message");
      expect(resp.body.message).to.equal(
        "Incorrect email or password. Please try again brate :)"
      );
    });
  });

  describe("POST /register", function () {
    it("should register a new user", async function () {
      const newUser = {
        fullname: "New User",
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const resp = await global.api.post("/register").send(newUser).expect(200);

      expect(resp.body).to.have.property(
        "message",
        "User registered successfully."
      );
      expect(resp.body).to.have.property("token");
    });

    it("should return 409 if the email is already in use", async function () {
      const newUser = {
        fullname: "New User",
        email: "ivana.ivic@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const resp = await global.api.post("/register").send(newUser).expect(409);

      expect(resp.body).to.have.property("message", "Email is already in use.");
    });
  });
});
