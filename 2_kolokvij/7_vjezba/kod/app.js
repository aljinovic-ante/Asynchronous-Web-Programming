require('dotenv-safe').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Centralized error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    switch (err.message) {
      case "Author not found":
      case "Song not found":
        ctx.status = 404;
        ctx.body = { error: err.message };
        break;
      case "User already exists!!":
        ctx.status = 400;
        ctx.body = { message: err.message };
        break;
      case "Resource vec lockan":
        ctx.status = 409;
        ctx.body = { message: err.message };
        break;
      case "Error no rights":
        ctx.status = 403;
        ctx.body = { message: err.message };
        break;
      default:
        ctx.status = 400;
        ctx.body = { error: err.message };
    }
  }
});

// Load routes from the routes directory
const indexRoutes = require('./route/index');
const authorRoutes = require('./route/authors');
const songRoutes = require('./route/songs');
app.use(require('./route/authors_songs').routes());
// Use routes
app.use(indexRoutes.routes());
app.use(authorRoutes.routes());
app.use(songRoutes.routes());

module.exports = app;
