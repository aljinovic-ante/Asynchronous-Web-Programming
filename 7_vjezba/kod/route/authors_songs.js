const Router = require('@koa/router');
const authorSongRepo = require('../repo/authors_songs');
const Joi = require('joi');
const validationMiddleware = require('../db/middleware/validate');
const { jwtCheck } = require('../db/middleware/auth')
const router = new Router();

router.post('/authors/:authorId/songs/:songId', 
  validationMiddleware.params({
    authorId:Joi.number().integer().required(),
    songId:Joi.number().integer().required(),
  }),jwtCheck,
  async ctx => {
  ctx.body = await authorSongRepo.createAuthorSongRelation(
    ctx.params.authorId,
    ctx.params.songId
  );
});

router.delete('/authors/:authorId/songs/:songId',
  validationMiddleware.params({
    authorId:Joi.number().integer().required(),
    songId:Joi.number().integer().required(),
  }),jwtCheck,
  async ctx => {
  await authorSongRepo.deleteAuthorSongRelation(ctx.params.authorId, ctx.params.songId);
  ctx.body = { message: 'Relation deleted' };
});


router.get('/authors/:authorId/songs',
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async ctx => {
  ctx.body = await authorSongRepo.getSongsByAuthorId(ctx.params.authorId);
});

module.exports = router;
