const Koa = require('koa');
const app = new Koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

handlers.forEach(handler => require('./middlewares/' + handler).init(app));

// app.use((ctx, next) => {
//   ctx.cookies.set('csrf', ctx.csrf, { signed: false, httpOnly: true });
//   return next();
// });

// can be split into files too
const Router = require('koa-router');

const router = new Router();

router.get('/', require('./routes/frontpage').get);
router.post('/login', require('./routes/login').post);
router.post('/logout', require('./routes/logout').post);

app.use(router.routes());

app.listen(3000);
