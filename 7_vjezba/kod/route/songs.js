const Router = require('@koa/router');
const songRepo = require('../repo/songs');
const Joi = require('joi');
const validationMiddleware = require('../db/middleware/validate');
const { pessimisticLock } = require('../db/middleware/pessimistic_middleware');
const { jwtCheck } = require('../db/middleware/auth')
const router = new Router();

router.post('/songs', 
  validationMiddleware.body({
    name:Joi.string().trim().required(),
  }),jwtCheck,
  async ctx => {
  ctx.body = await songRepo.createSong(ctx.request.body);
  ctx.status = 200;
});

router.get('/songs', async ctx => {
  ctx.body = await songRepo.getAllSongs();
});

router.get('/songs/:songId', 
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),
  //pessimisticLock,
  async ctx => {
    const song = await songRepo.getSongById(ctx.params.songId);
    if (!song) {
      ctx.status = 404;
      ctx.body = { message: 'Song not found' };
      return;
    }
    ctx.body = song;
  }
);

router.put('/songs/:songId', 
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),jwtCheck
  //,pessimisticLock
  ,validationMiddleware.body({
    name: Joi.string().trim().required(),
  })
  ,async ctx => {
  ctx.body = await songRepo.updateSong(ctx.params.songId, ctx.request.body);
});

router.delete('/songs/:songId',
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),jwtCheck,
  async ctx => {
    await songRepo.deleteSong(ctx.params.songId);
    ctx.status = 204;
  }
);

module.exports = router;
