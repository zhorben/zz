
// Usually served by Nginx
import serve from 'koa-static'
import config from 'config'
import path from 'path'

export default serve(path.resolve(config.root, 'public'))
