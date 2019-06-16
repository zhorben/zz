exports.get = async function(ctx, next) {
  if (ctx.isAuthenticated()) { // ctx.request.user ?
    ctx.body = ctx.render('welcome');
  } else {
    ctx.body = ctx.render('login');
  }

};
