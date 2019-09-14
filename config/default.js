const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: 'mysecret',
  server: {
    siteHost: process.env.SITE_HOST || 'http://localhost:3000'
  },
  root: process.cwd(),
  port: process.env.PORT || 3000,
  mongoDB: process.env.MONGODB_URI || 'mongodb://localhost/zhorben',
  mongoose: {
    uri: 'mongodb://localhost/zhorben',
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
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
  providers: {
    facebook: {
      appId: '1584514044907807',
      appSecret: '339a49fe96f98727d1fe5cc5fdc531d0',
      // test: {
      //   login: 'course.test.facebook@gmail.com',
      //   password: 'course-test-facebook'
      // },
      passportOptions: {
        display: 'popup',
        scope:   ['email']
      }
    },
    google: {
      appId: '459579862914-nsitd0p492vaap2adieodccrafricanl.apps.googleusercontent.com',
      appSecret: 'w8GLPlarlZFdzp73OtgYPM6j',
      passportOptions: {
        scope:   ['profile', 'email']
      }
    }
  },
};
