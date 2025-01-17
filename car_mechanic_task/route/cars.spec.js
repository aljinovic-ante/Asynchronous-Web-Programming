const { expect } = require("chai");
const carsRepo = require("../repo/cars");
const { getAuthHeadersForUserId } = require("../apiTest");

describe("Cars routes", function () {
  describe("GET /cars", function () {
    it("should fetch cars", async function () {
      const resp = await global.api
        .get("/cars")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(resp.body.length > 0).to.be.true;
      expect(Object.keys(resp.body[0])).to.deep.equal([
        "id",
        "make",
        "model",
        "userid",
        "manufacturingyear",
      ]);
    });
  });
  describe("GET /cars/:carId", function () {
    let createdCar;

    before(async function () {
      createdCar = await carsRepo.createCar({
        make: "Test",
        model: "Test2",
        userid: "1",
        manufacturingyear: "2022",
      });
    });

    it("should fetch a car by id", async function () {
      const resp = await global.api
        .get(`/cars/${createdCar.id}`)
        .expect(200)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(200);

      expect(resp.body).to.have.property("id");
      expect(resp.body.make).to.be.equal(createdCar.make);
      expect(resp.body.model).to.be.equal(createdCar.model);
      expect(resp.body.userid).to.be.equal(createdCar.userid);
      expect(resp.body.manufacturingyear).to.be.equal(
        createdCar.manufacturingyear
      );
    });

    it("should return 404 for a non-existent car", async function () {
      const resp = await global.api
        .get("/cars/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(404);

      expect(resp.body.message).to.equal("Car not found");
    });
  });
  describe("PUT /cars/:carId", function () {
    let createdCar;

    before(async function () {
      createdCar = await carsRepo.createCar({
        make: "Test Make",
        model: "Test Model",
        userid: "1",
        manufacturingyear: "2022",
      });
    });

    it("should update a car by id", async function () {
      const updatedCarData = {
        make: "Updated Make",
        model: "Updated Model",
        manufacturingyear: 2023,
      };

      const resp = await global.api
        .put(`/cars/${createdCar.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(updatedCarData)
        .expect(200);

      expect(resp.body.make).to.equal(updatedCarData.make);
      expect(resp.body.model).to.equal(updatedCarData.model);
      expect(resp.body.userid).to.equal(createdCar.userid);
      expect(resp.body.manufacturingyear).to.equal(
        updatedCarData.manufacturingyear
      );
    });

    it("should return 404 for a non-existent car during update", async function () {
      const updatedCarData = { make: "Updated Make" };
      const resp = await global.api
        .put("/cars/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .send(updatedCarData)
        .expect(404);

      expect(resp.body.message).to.equal("Car not found");
    });
  });

  describe("DELETE /cars/:carId", function () {
    let createdCar;

    before(async function () {
      createdCar = await carsRepo.createCar({
        make: "Test Make",
        model: "Test Model",
        userid: "1",
        manufacturingyear: "2022",
      });
    });

    it("should delete a car by id", async function () {
      const resp = await global.api
        .delete(`/cars/${createdCar.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(204);

      const checkResp = await global.api
        .get(`/cars/${createdCar.id}`)
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(404);

      expect(checkResp.body.message).to.equal("Car not found");
    });

    it("should return 404 for a non-existent car during delete", async function () {
      const resp = await global.api
        .delete("/cars/99999")
        .set("Authorization", await getAuthHeadersForUserId(1))
        .expect(404);

      expect(resp.body.message).to.equal("Car not found");
    });
  });
});
