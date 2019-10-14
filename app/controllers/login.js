import passport from '../libs/passport'

export default async (ctx, next) => {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err

    if (user) {
      ctx.body = {
        token: await ctx.login(user)
      }
    } else {
      ctx.status = 400
      ctx.body = info
    }

  })(ctx, next)
}

