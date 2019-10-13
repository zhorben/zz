import Koa from 'koa'
import config from 'config'
import compose from 'koa-compose'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import pick from 'lodash/pick'

import middlewares from './middlewares'
import router from './routes'

import Session from './models/Session'
import User from './models/User'

const app = new Koa()

app.keys = [config.secret]

app.use(compose(middlewares))
app.use(...middlewares)

app.use((ctx, next) => {
  ctx.login = async (user) => {
    const payload = pick(user, User.publicFields)
    const token = jwt.sign(payload, config.jwtSecret, { algorithm: 'HS512'})
    
    await Session.create({ token, user, lastVisit: new Date() })

    return token
  }

  return next()
})

app.use(router.routes())

// this for HTML5 history in browser
const index = fs.readFileSync(path.join(__dirname, 'public/index.html'))
app.use(async (ctx) => {
  if (!ctx.url.startsWith('/api')) {
    ctx.set('content-type', 'text/html')
    ctx.body = index
  }
})

export default app

app.listen(3000)


