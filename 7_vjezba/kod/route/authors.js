const Router = require('@koa/router');
const authorRepo = require('../repo/authors');
const Joi = require('joi');
const validationMiddleware = require('../db/middleware/validate');
const { pessimisticLock } = require('../db/middleware/pessimistic_middleware');
const { jwtCheck } = require('../db/middleware/auth')
const router = new Router();

router.post('/authors', 
  validationMiddleware.body({
    name:Joi.string().trim().required(),
  }),jwtCheck
  ,async ctx => {
  ctx.body = await authorRepo.createAuthor(ctx.request.body);
  ctx.status = 200;
});

router.get('/authors', async ctx => {
  ctx.body = await authorRepo.getAllAuthors();
});

router.get('/authors/:authorId', 
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  })
  //,pessimisticLock
  ,async ctx => {
    const author = await authorRepo.getAuthorById(ctx.params.authorId);
    if (!author) {
      throw new Error("Author not found")
    }
    ctx.body = author;
  }
);

router.put('/authors/:authorId',
  validationMiddleware.body({
    name:Joi.string().trim().required(),
  }),jwtCheck
  //,pessimisticLock
  ,validationMiddleware.params({
    authorId:Joi.number().integer().required(),
  })
  ,async ctx => {
  ctx.body = await authorRepo.updateAuthor(ctx.params.authorId, ctx.request.body);
});

router.delete('/authors/:authorId',
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),jwtCheck,
  async (ctx) => {
    const author = await authorRepo.getAuthorById(ctx.params.authorId);
    if (!author) {
      throw new Error("Author not found")
    }
    await authorRepo.deleteAuthor(ctx.params.authorId);
    ctx.status = 204;
  }
);

module.exports = router;
