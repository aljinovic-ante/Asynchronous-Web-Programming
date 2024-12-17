require('dotenv-safe').config()
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(bodyParser())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error(err)
    ctx.body = {
      err,
      message: err.message
    }
  }
})

app.use(require('./route/index').routes())
app.use(require('./route/authors').routes());
app.use(require('./route/songs').routes());
app.use(require('./route/users').routes());
app.use(require('./route/authors_songs').routes());
app.use(require('./route/resource_locks').routes());

module.exports = app

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
