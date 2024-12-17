const Router = require('@koa/router')
const authorsRouter = require('./authors')
const songsRouter = require('./songs')
const authorsSongsRouter = require('./authors_songs')
const indexRepo = require('../repo/index')

const router = new Router()

router.get('/health', async function (ctx) {
	ctx.body = await indexRepo.getHealthInfo()
})

router.use(authorsRouter.routes());
router.use(songsRouter.routes());
router.use(authorsSongsRouter.routes());

module.exports = router