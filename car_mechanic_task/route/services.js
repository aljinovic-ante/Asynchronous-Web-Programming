const Router = require("@koa/router");
const serviceRepo = require("../repo/services");
const Joi = require("joi");
const validationMiddleware = require("../db/middleware/validate");
const { jwtCheck } = require("../db/middleware/auth");
const router = new Router();

router.post(
  "/services",
  jwtCheck,
  validationMiddleware.body({
    mechanicid: Joi.number().integer().required(),
    carid: Joi.number().integer().required(),
    description: Joi.string().trim().optional(),
    status: Joi.string().required(),
    starttime: Joi.date().iso().optional(),
    endtime: Joi.date().iso().optional(),
    price: Joi.number().precision(2).min(0).required(),
  }),
  async (ctx) => {
    ctx.body = await serviceRepo.createService(ctx.request.body);
    ctx.status = 200;
  }
);

router.get("/services", jwtCheck, async (ctx) => {
  ctx.body = await serviceRepo.getServices();
});

router.get(
  "/services/:serviceId",
  jwtCheck,
  validationMiddleware.params({
    serviceId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const service = await serviceRepo.getServiceById(ctx.params.serviceId);
    if (!service) {
      ctx.status = 404;
      ctx.body = { message: "Service not found" };
      return;
    }
    ctx.body = service;
  }
);

router.get(
  "/services/mechanic/:mechanicId",
  jwtCheck,
  validationMiddleware.params({
    mechanicId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    ctx.body = await serviceRepo.getServicesByMechanicId(ctx.params.mechanicId);
  }
);

router.get(
  "/services/car/:carId",
  jwtCheck,
  validationMiddleware.params({
    carId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    ctx.body = await serviceRepo.getServicesByCarId(ctx.params.carId);
  }
);

router.put(
  "/services/:serviceId",
  jwtCheck,
  validationMiddleware.params({
    serviceId: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    mechanicid: Joi.number().integer().optional(),
    carid: Joi.number().integer().optional(),
    description: Joi.string().trim().optional(),
    status: Joi.string()
      .valid("pending", "in progress", "completed")
      .optional(),
    starttime: Joi.date().iso().optional(),
    endtime: Joi.date().iso().optional(),
    price: Joi.number().precision(2).min(0).optional(),
  }),
  async (ctx) => {
    const updatedService = await serviceRepo.updateService(
      ctx.params.serviceId,
      ctx.request.body
    );
    if (!updatedService) {
      ctx.status = 404;
      ctx.body = { message: "Service not found" };
      return;
    }
    ctx.body = updatedService;
  }
);

router.delete(
  "/services/:serviceId",
  jwtCheck,
  validationMiddleware.params({
    serviceId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const deletedCount = await serviceRepo.deleteService(ctx.params.serviceId);
    if (!deletedCount) {
      ctx.status = 404;
      ctx.body = { message: "Service not found" };
      return;
    }
    ctx.status = 204;
  }
);

module.exports = router;
