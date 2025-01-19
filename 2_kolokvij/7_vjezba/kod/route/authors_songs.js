const Router = require('@koa/router');
const authorSongRepo = require('../repo/authors_songs');
const router = new Router();
router.post('/authors/:authorId/songs/:songId', async ctx => {
  ctx.body = await authorSongRepo.createAuthorSongRelation(
    ctx.params.authorId,
    ctx.params.songId
  );
});
router.delete('/authors/:authorId/songs/:songId', async ctx => {
  await authorSongRepo.deleteAuthorSongRelation(ctx.params.authorId, ctx.params.songId);
  ctx.body = { message: 'Relation deleted' };
});
router.get('/authors/:authorId/songs', async ctx => {
  ctx.body = await authorSongRepo.getSongsByAuthorId(ctx.params.authorId);
});
module.exports = router;