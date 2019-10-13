
import Router from 'koa-router'
import session from '../controllers/session'

import auth from './auth'

const router = new Router({
  prefix: '/api'
})

router.use(session)

router.use(auth)

export default router