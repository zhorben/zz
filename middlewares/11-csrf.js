const CSRF = require('koa-csrf');
// ctx.csrf
exports.init = app => {
  app.use(new CSRF({
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
    disableQuery: false
  }));
}

// localhost:3000/logout

/*
  http://localhost:3000/transferMoney?to=ID&amount=100
  cookie? -> tranfer


  Look at this cat!
  http://localhost:3000/transferMoney?to=HACKER&amount=100
  cookie? -> tranfer
*/
