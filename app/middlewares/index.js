import favicon from './favicon'
import staticServe from './static'
import logger from './logger'
import errors from './errors'
import bodyParser from './bodyParser'
import cors from './cors'
import login from './login'

export default [
  favicon,
  cors,
  staticServe,
  logger,
  errors,
  bodyParser,
  login
]