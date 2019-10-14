import Router from 'koa-router'
import { handleMongooseValidationError } from '../libs/validationErrors'

import login from '../controllers/login'
import registration from '../controllers/registration'
import { oauth, oauthCallback } from '../controllers/oauth'

const router = new Router()

router.post('/login', login)
router.post('/register', handleMongooseValidationError, registration.register)
router.post('/confirm', registration.confirm)
router.get('/oauth/:provider', oauth)
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback)

export default router.routes()
