import Koa from 'koa'
import config from 'config'

import middlewares from './middlewares'
import router from './routes'

import './libs/mongoose'

const app = new Koa()

app.keys = [config.secret]

app.use(...middlewares)


// const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort()

// middlewares.forEach((middleware) => {
//   // console.log(import('./middlewares/' + middleware), '--- hei')
//   app.use(import('./middlewares/' + middleware))
// })

// app.use((ctx, next) => {
//   ctx.cookies.set('csrf', ctx.csrf, { signed: false, httpOnly: true });
//   return next();
// });

app.use(router.routes())

export default app

app.listen(3000)


