import Session from '../models/Session'
import User from '../models/User'
import passport from '../libs/passport'
import config from 'config'
import jwt from 'jsonwebtoken'
import pick from 'lodash/pick'

export default async (ctx, next) => {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err

    if (user) {
      ctx.body = {
        token: ctx.login(user)
      }
    } else {
      ctx.status = 400
      ctx.body = info
    }

  })(ctx, next)
}

