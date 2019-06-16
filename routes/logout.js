
exports.post = async function(ctx, next) {
  ctx.logout(); // delete ctx.session.passport

  ctx.session = null; // destroy session (!!!)

  ctx.redirect('/');
};
