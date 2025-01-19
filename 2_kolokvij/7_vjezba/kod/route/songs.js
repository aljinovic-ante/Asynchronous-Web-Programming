const Router = require('@koa/router');
const songRepo = require('../repo/songs');
const router = new Router();
router.post('/songs', async ctx => {
  ctx.body = await songRepo.createSong(ctx.request.body);
});
router.get('/songs', async ctx => {
  ctx.body = await songRepo.getAllSongs();
});
router.get('/songs/:songId', async ctx => {
  ctx.body = await songRepo.getSongById(ctx.params.songId);
});
router.put('/songs/:songId', async ctx => {
  ctx.body = await songRepo.updateSong(ctx.params.songId, ctx.request.body);
});
router.delete('/songs/:songId', async ctx => {
  ctx.body = await songRepo.deleteSong(ctx.params.songId);
});
module.exports = router;