const { expect } = require("chai");
const userServicesRepo = require("../repo/user_services");
const { getAuthHeadersForUserId } = require("../apiTest");

describe("User Services Routes", function () {
  describe("POST /user_services", function () {
    it("should create a new user-service association", async function () {
      const newUserService = {
        userid: 2,
        serviceid: 2,
      };

      const resp = await global.api
        .post("/user_services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(newUserService)
        .expect(200);

      expect(resp.body).to.have.property("userid");
      expect(resp.body).to.have.property("serviceid");
      expect(resp.body.userid).to.equal(newUserService.userid);
      expect(resp.body.serviceid).to.equal(newUserService.serviceid);
    });

    it("should return 400 if the association already exists", async function () {
      const existingUserService = { userid: 1, serviceid: 1 };

      userServicesRepo.userServiceExists = async () => true;

      const resp = await global.api
        .post("/user_services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(existingUserService)
        .expect(400);

      expect(resp.body).to.have.property("message");
      expect(resp.body.message).to.equal("Association already exists");
    });
  });

  describe("GET /user_services", function () {
    it("should fetch all user-service associations", async function () {
      const resp = await global.api
        .get("/user_services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length).to.be.greaterThan(0);
    });
  });

  describe("GET /user_services/user/:userid", function () {
    let createdAssociation;
    before(async function () {
      createdAssociation = await userServicesRepo.addUserService(1, 1);
    });

    it("should fetch services associated with a user", async function () {
      const resp = await global.api
        .get("/user_services/user/1")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length).to.be.greaterThan(0);
      expect(resp.body[0]).to.have.property(
        "serviceid",
        createdAssociation.serviceid
      );
      expect(resp.body[0]).to.have.property(
        "userid",
        createdAssociation.userid
      );
    });
  });

  describe("GET /user_services/service/:serviceid", function () {
    it("should fetch users associated with a service", async function () {
      const resp = await global.api
        .get("/user_services/service/1")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length).to.be.greaterThan(0);
      expect(resp.body[0]).to.have.property("userid", 1);
      expect(resp.body[0]).to.have.property("serviceid", 1);
    });
  });

  describe("DELETE /user_services", function () {
    it("should delete a user-service association", async function () {
      const resp = await global.api
        .delete("/user_services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send({ userid: 1, serviceid: 1 })
        .expect(204);
    });

    it("should return 404 for a non-existent association during delete", async function () {
      const resp = await global.api
        .delete("/user_services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send({ userid: 99999, serviceid: 99999 })
        .expect(404);

      expect(resp.body.message).to.equal("Association not found");
    });
  });
});
