const User = require('../models/user');

exports.get = async function(ctx, next) {

  const user = await User.findOne({
    verifyEmailToken: ctx.params.verifyEmailToken
  });

  if (!user) {
    ctx.throw(404, 'Ссылка подтверждения недействительна или устарела.');
  }

  if (!user.verifiedEmail) {
    user.verifiedEmail = true;
  }

  user.verifyEmailToken = null;

  await user.save();

  // await ctx.login(user);

  ctx.flash('success', 'Вы успешно подтвердили свой Email.');
  ctx.redirect('/');
};
