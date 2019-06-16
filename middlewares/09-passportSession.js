exports.init = app => app.use(require('koa-passport').session());
// ctx.session.passport = {}
// ctx.req.user && ctx.request.user
