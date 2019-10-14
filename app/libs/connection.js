import mongoose from 'mongoose'
import config from 'config'
import beautifyUnique from 'mongoose-beautiful-unique-validation'

mongoose.set('debug', true)

mongoose.plugin(beautifyUnique)

export default mongoose.createConnection(config.mongodb.uri, config.mongoose.options)
