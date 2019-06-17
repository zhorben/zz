const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: 'mysecret',
  root: process.cwd(),
  port: process.env.PORT || 3000,
  mongoDB: process.env.MONGODB_URI || 'mongodb://localhost/zhorben',
  mongoose: {
    uri: 'mongodb://localhost/zhorben',
    options: {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  },
  crypto: {
    hash: {
      length:     128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV == 'production' ? 12000 : 1
    }
  },
  template: {
    // template.root uses config.root
    root: defer(function(cfg) {
      return path.join(cfg.root, 'templates');
    })
  },
};
