import jwt from 'jsonwebtoken'
import pick from 'lodash/pick'
import config from 'config'

import Session from '../models/Session'
import User from '../models/User'

export default (ctx, next) => {
  ctx.login = async (user) => {
    const payload = pick(user, User.publicFields)
    const token = jwt.sign(payload, config.jwtSecret, { algorithm: 'HS512'})

    console.log(token)
    
    await Session.create({ token, user, lastVisit: new Date() })

    return token
  }

  return next()
}