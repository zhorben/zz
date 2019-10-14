import Koa from 'koa'
import config from 'config'
import compose from 'koa-compose'
import fs from 'fs'
import path from 'path'

import middlewares from './middlewares'
import router from './routes'

const app = new Koa()

app.keys = [config.secret]

app.use(compose(middlewares))
app.use(...middlewares)

app.use(router.routes())

// this for HTML5 history in browser
const index = fs.readFileSync(path.resolve(config.root, 'public/index.html'))
app.use(async (ctx) => {
  if (!ctx.url.startsWith('/api')) {
    ctx.set('content-type', 'text/html')
    ctx.body = index
  }
})

export default app

app.listen(3000)


