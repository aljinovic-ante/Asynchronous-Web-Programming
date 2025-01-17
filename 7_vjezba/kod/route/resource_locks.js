const Router = require('@koa/router');
const Joi = require('joi');
const { jwtCheck } = require('../db/middleware/auth')
const validationMiddleware = require('../db/middleware/validate');
const resourceLocksRepo = require('../repo/resource_locks.js');
const router = new Router();

router.post(
  '/resource-locks',
  validationMiddleware.body({
    resource_type: Joi.string().valid('author', 'song').required(),
    resource_id: Joi.number().integer().required(),
  }),
  jwtCheck,
  async (ctx) => {
    const { resource_type, resource_id } = ctx.request.body;
    const userId = ctx.state.user.id;

    const existingLock = await resourceLocksRepo.getLock(resource_type, resource_id);
    if (existingLock) {
      throw new Error("Resource vec lockan")
    }

    await resourceLocksRepo.createLock({ resource_type, resource_id, user_id: userId });
    ctx.status = 201;
    ctx.body = { message: 'Resource lockan' };
  }
);

router.delete(
  '/resource-locks/:resourceId',
  validationMiddleware.params({
    resourceId: Joi.number().integer().required(),
  }),jwtCheck,
  async (ctx) => {
    const resourceId = ctx.params.resourceId;
    const userId = ctx.state.user.id;

    const deletedCount = await resourceLocksRepo.deleteLockByUser(resourceId, userId);
    if (deletedCount === 0) {
      throw new Error("Error no rights")
    }

    ctx.status = 204;
    ctx.body = null;
  }
);

module.exports = router;
