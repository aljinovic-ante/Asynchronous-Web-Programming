require('dotenv-safe').config();
const { koaSwagger } = require('koa2-swagger-ui');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const yaml = require('yamljs');
const app = new Koa();

const swaggerDocument = yaml.load('./swagger_docs.yaml');

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message,
    };
  }
});

app.use(
  koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: {
      spec: swaggerDocument,
    },
  })
);

app.use(require('./route/users').routes());
app.use(require('./route/cars').routes());
app.use(require('./route/services').routes());
app.use(require('./route/user_services').routes());

module.exports = app;
