import { KoaPassport } from 'koa-passport'

import localStrategy from './strategies/local'
// import facebookStrategy from './strategies/facebook'
// import googleStrategy from './strategies/google'

const passport = new KoaPassport()

passport.use(localStrategy)
// passport.use(facebookStrategy)
// passport.use(googleStrategy)

export default passport
