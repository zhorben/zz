const passport = require('koa-passport');

require('./serialize');

passport.use(require('./localStrategy'));
passport.use(require('./facebookStrategy'));
passport.use(require('./googleStrategy'));

module.exports = passport;
