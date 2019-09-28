if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const config = require('config');
const mongoose = require('./libs/mongoose');
const passport = require('./libs/passport');

const path = require('path');
const fs = require('fs');

app.keys = [config.secret];

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
router.post('/register', require('./routes/register').post);
router.get('/register', require('./routes/register').get);

router.get('/verify-email/:verifyEmailToken', require('./routes/verifyEmail').get);

// login
router.get('/login/facebook', passport.authenticate('facebook', config.providers.facebook.passportOptions));
router.get('/login/google', passport.authenticate('google', config.providers.google.passportOptions));
// connect with existing profile
router.get('/connect/facebook', passport.authorize('facebook', config.providers.facebook.passportOptions));

router.get('/oauth/facebook', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true // req.flash
}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true // req.flash
}));

app.use(router.routes());

module.exports = app;

if (!module.parent) {
  app.listen(3000);
}
