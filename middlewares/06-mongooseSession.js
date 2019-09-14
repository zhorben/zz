const session = require('koa-session');
const mongooseStore = require('koa-session-mongoose');
const mongoose = require('../libs/mongoose');
const config = require('config');

exports.init = app => app.use(session({
  key:     config.secret,
  rolling: true,

  store: mongooseStore.create({
    name: 'Session',
    expires: 3600 * 4,
    connection: mongoose
  })
}, app));
