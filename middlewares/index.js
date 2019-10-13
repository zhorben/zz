import favicon from './favicon'
import staticServe from './static'
import logger from './logger'
import errors from './errors'
import bodyParser from './bodyParser'
import cors from './cors'

export default [
  favicon,
  cors,
  staticServe,
  logger,
  errors,
  bodyParser
]