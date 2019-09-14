/**
 * This file must be required at least ONCE.
 * After it's done, one can use require('mongoose')
 *
 * In web-app: ctx is done at init phase
 * In tests: in mocha.opts
 * In gulpfile: in beginning
 */

const mongoose = require('mongoose');
const config = require('config');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.Promise = Promise;

mongoose.set('debug', true);

mongoose.connect(config.mongoose.uri, config.mongoose.options);

// вместо MongoError будет выдавать ValidationError (проще ловить и выводить)
mongoose.plugin(beautifyUnique);

module.exports = mongoose;
