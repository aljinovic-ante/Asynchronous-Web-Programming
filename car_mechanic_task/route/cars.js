const Router = require("@koa/router");
const carRepo = require("../repo/cars");
const Joi = require("joi");
const validationMiddleware = require("../db/middleware/validate");
const { jwtCheck } = require("../db/middleware/auth");

const router = new Router();

router.post(
  "/cars",
  validationMiddleware.body({
    make: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    userid: Joi.number().integer().required(),
    manufacturingyear: Joi.number()
      .integer()
      .max(new Date().getFullYear())
      .optional(),
  }),
  jwtCheck,
  async (ctx) => {
    ctx.body = await carRepo.createCar(ctx.request.body);
    ctx.status = 200;
  }
);

router.get("/cars", jwtCheck, async (ctx) => {
  ctx.body = await carRepo.getCars();
});

router.get(
  "/cars/:carId",
  validationMiddleware.params({
    carId: Joi.number().integer().required(),
  }),
  jwtCheck,
  async (ctx) => {
    const car = await carRepo.getCarById(ctx.params.carId);
    if (!car) {
      ctx.status = 404;
      ctx.body = { message: "Car not found" };
      return;
    }
    ctx.body = car;
  }
);

router.put(
  "/cars/:carId",
  jwtCheck,
  validationMiddleware.params({
    carId: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    make: Joi.string().trim().optional(),
    model: Joi.string().trim().optional(),
    userid: Joi.number().integer().optional(),
    manufacturingyear: Joi.number()
      .integer()
      .max(new Date().getFullYear())
      .optional(),
  }),
  async (ctx) => {
    const updatedCar = await carRepo.updateCar(
      ctx.params.carId,
      ctx.request.body
    );
    if (!updatedCar) {
      ctx.status = 404;
      ctx.body = { message: "Car not found" };
      return;
    }
    ctx.body = updatedCar;
  }
);

router.delete(
  "/cars/:carId",
  validationMiddleware.params({
    carId: Joi.number().integer().required(),
  }),
  jwtCheck,
  async (ctx) => {
    const deletedCount = await carRepo.deleteCar(ctx.params.carId);
    if (!deletedCount) {
      ctx.status = 404;
      ctx.body = { message: "Car not found" };
      return;
    }
    ctx.status = 204;
  }
);

module.exports = router;
