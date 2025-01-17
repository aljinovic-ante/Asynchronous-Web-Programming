const { expect } = require("chai");
const serviceRepo = require("../repo/services");
const { getAuthHeadersForUserId } = require("../apiTest");

describe("Services routes", function () {
  describe("GET /services", function () {
    it("should fetch services", async function () {
      const resp = await global.api
        .get("/services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(Object.keys(resp.body[0])).to.deep.equal([
        "id",
        "mechanicid",
        "carid",
        "description",
        "status",
        "starttime",
        "endtime",
        "price",
      ]);
    });
  });

  describe("GET /services/:serviceId", function () {
    let createdService;

    before(async function () {
      createdService = await serviceRepo.createService({
        mechanicid: 1,
        carid: 1,
        description: "Test Service",
        status: "pending",
        starttime: new Date(),
        price: 100.0,
      });
    });

    it("should fetch a service by id", async function () {
      const resp = await global.api
        .get(`/services/${createdService.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(resp.body.mechanicid).to.equal(createdService.mechanicid);
      expect(resp.body.carid).to.equal(createdService.carid);
      expect(resp.body.description).to.equal(createdService.description);
      expect(resp.body.status).to.equal(createdService.status);
      expect(resp.body.price).to.equal(createdService.price);
    });

    it("should return 404 for a non-existent service", async function () {
      const resp = await global.api
        .get("/services/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(404);

      expect(resp.body.message).to.equal("Service not found");
    });
  });

  describe("POST /services", function () {
    it("should create a new service", async function () {
      const newService = {
        mechanicid: 1,
        carid: 1,
        description: "New service test",
        status: "pending",
        starttime: new Date(),
        price: 150.0,
      };

      const resp = await global.api
        .post("/services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(newService)
        .expect(200);

      expect(resp.body).to.have.property("id");
      expect(resp.body.mechanicid).to.equal(newService.mechanicid);
      expect(resp.body.carid).to.equal(newService.carid);
      expect(resp.body.description).to.equal(newService.description);
      expect(resp.body.status).to.equal(newService.status);
      expect(resp.body.price).to.equal(newService.price);
    });

    it("should return 400 if required fields are missing", async function () {
      const incompleteService = { mechanicid: 1, carid: 1 };

      const resp = await global.api
        .post("/services")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(incompleteService)
        .expect(400);

      expect(resp.body).to.have.property("message");
    });
  });

  describe("PUT /services/:serviceId", function () {
    let createdService;

    before(async function () {
      createdService = await serviceRepo.createService({
        mechanicid: 1,
        carid: 1,
        description: "Test service",
        status: "pending",
        starttime: new Date(),
        price: 100.0,
      });
    });

    it("should update a service by id", async function () {
      const updatedServiceData = {
        description: "Updated service description",
        status: "in progress",
        price: 120.0,
      };

      const resp = await global.api
        .put(`/services/${createdService.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(updatedServiceData)
        .expect(200);

      expect(resp.body.description).to.equal(updatedServiceData.description);
      expect(resp.body.status).to.equal(updatedServiceData.status);
      expect(resp.body.price).to.equal(updatedServiceData.price);
    });

    it("should return 404 for a non-existent service during update", async function () {
      const updatedServiceData = { description: "Updated description" };

      const resp = await global.api
        .put("/services/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(updatedServiceData)
        .expect(404);

      expect(resp.body.message).to.equal("Service not found");
    });
  });

  describe("DELETE /services/:serviceId", function () {
    let createdService;

    before(async function () {
      createdService = await serviceRepo.createService({
        mechanicid: 1,
        carid: 1,
        description: "Service to be deleted",
        status: "completed",
        starttime: new Date(),
        price: 100.0,
      });
    });

    it("should delete a service by id", async function () {
      const resp = await global.api
        .delete(`/services/${createdService.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(204);

      const checkResp = await global.api
        .get(`/services/${createdService.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(404);

      expect(checkResp.body.message).to.equal("Service not found");
    });

    it("should return 404 for a non-existent service during delete", async function () {
      const resp = await global.api
        .delete("/services/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(404);

      expect(resp.body.message).to.equal("Service not found");
    });
  });

  describe("GET /services/mechanic/:mechanicId", function () {
    it("should fetch services by mechanic id", async function () {
      const resp = await global.api
        .get("/services/mechanic/1")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length > 0).to.be.true;
    });

    it("should return an empty array if no services found for mechanic", async function () {
      const resp = await global.api
        .get("/services/mechanic/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(resp.body).to.deep.equal([]);
    });
  });

  describe("GET /services/car/:carId", function () {
    it("should fetch services by car id", async function () {
      const resp = await global.api
        .get("/services/car/1")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length > 0).to.be.true;
    });

    it("should return an empty array if no services found for car", async function () {
      const resp = await global.api
        .get("/services/car/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(resp.body).to.deep.equal([]);
    });
  });
});
