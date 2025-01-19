const Router = require('@koa/router');
const authorRepo = require('../repo/authors');
const router = new Router();
router.post('/authors', async ctx => {
  ctx.body = await authorRepo.createAuthor(ctx.request.body);
});
router.get('/authors', async ctx => {
  ctx.body = await authorRepo.getAllAuthors();
});
router.get('/authors/:authorId', async ctx => {
  ctx.body = await authorRepo.getAuthorById(ctx.params.authorId);
});
router.put('/authors/:authorId', async ctx => {
  ctx.body = await authorRepo.updateAuthor(ctx.params.authorId, ctx.request.body);
});
router.delete('/authors/:authorId', async ctx => {
  ctx.body = await authorRepo.deleteAuthor(ctx.params.authorId);
});
module.exports = router;