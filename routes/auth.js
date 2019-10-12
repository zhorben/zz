import Router from 'koa-router'
import passport from '../libs/passport'
const config = require('config')

import frontpage from '../controllers/frontpage'

const router = new Router()

console.log(passport, '--- hei')

const fp = (path) => require(`${config.root}/controllers/${path}`)

router.get('/', frontpage.get);
router.post('/login', fp('login').post);
router.post('/logout', fp('logout').post);
router.post('/register', fp('register').post);
router.get('/register', fp('register').get);
router.get('/verify-email/:verifyEmailToken', fp('verifyEmail').get);
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

export default router