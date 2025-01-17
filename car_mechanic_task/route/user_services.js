const Router = require("@koa/router");
const userServicesRepo = require("../repo/user_services");
const Joi = require("joi");
const validationMiddleware = require("../db/middleware/validate");
const { jwtCheck } = require("../db/middleware/auth");
const router = new Router();

router.post(
  "/user_services",
  validationMiddleware.body({
    userid: Joi.number().integer().required(),
    serviceid: Joi.number().integer().required(),
  }),
  jwtCheck,
  async (ctx) => {
    const exists = await userServicesRepo.userServiceExists(
      ctx.request.body.userid,
      ctx.request.body.serviceid
    );
    if (exists) {
      ctx.status = 400;
      ctx.body = { message: "Association already exists" };
      return;
    }
    ctx.body = await userServicesRepo.addUserService(
      ctx.request.body.userid,
      ctx.request.body.serviceid
    );
    ctx.status = 200;
  }
);

router.get("/user_services", jwtCheck, async (ctx) => {
  ctx.body = await userServicesRepo.getAllUserServices();
});

router.get(
  "/user_services/user/:userid",
  jwtCheck,
  validationMiddleware.params({
    userid: Joi.number().integer().required(),
  }),
  async (ctx) => {
    ctx.body = await userServicesRepo.getServicesByUserId(ctx.params.userid);
  }
);

router.get(
  "/user_services/service/:serviceid",
  jwtCheck,
  validationMiddleware.params({
    serviceid: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const usersByService = await userServicesRepo.getUsersByServiceId(ctx.params.serviceid);
    if (!usersByService) {
      ctx.status = 404;
      ctx.body = { message: "Users not found" };
      return;
    }
    ctx.body = usersByService;
  }
);

router.delete(
  "/user_services",
  jwtCheck,
  validationMiddleware.body({
    userid: Joi.number().integer().required(),
    serviceid: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const deletedCount = await userServicesRepo.removeUserService(
      ctx.request.body.userid,
      ctx.request.body.serviceid
    );
    if (!deletedCount) {
      ctx.status = 404;
      ctx.body = { message: "Association not found" };
      return;
    }
    ctx.status = 204;
  }
);

module.exports = router;
