require('dotenv-safe').config()
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(bodyParser())

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.message === "Author not found") {
      ctx.status = 404;
      ctx.body = { error: err.message };
    }
    else if (err.message === "Song not found") {
      ctx.status = 404;
      ctx.body = { error: err.message };
    }
    else if (err.message === "User already exists!!") {
      ctx.status = 400;
      ctx.body = { message: err.message };
    } 
    else if (err.message === "Resource vec lockan") {
      ctx.status = 409;
      ctx.body = { message: err.message };
    }
    else if (err.message === "Error no rights") {
      ctx.status = 403;
      ctx.body = { message: err.message };
    } else {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
});

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
