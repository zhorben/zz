const defer = require('config/defer').deferConfig;
const path = require('path');
require('dotenv').config()

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: process.env.SECRET,
  server: {
    siteHost: process.env.SITE_HOST
  },
  root: process.cwd(),
  port: process.env.PORT,
  mongoDB: process.env.MONGODB_URI,
  mongoose: {
    uri: process.env.MONGOOSE_URI,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
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
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
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
      appId: process.env.GOOGLE_APP_ID,
      appSecret: process.env.GOOGLE_APP_SECRET,
      passportOptions: {
        scope:   ['profile', 'email']
      }
    }
  },
  mailer: {
    // transport, aws
    transport: process.env.MAIL_TRANSPORT,
    gmail: {
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_ID,
      secretAccessKey: process.env.AWS_SECRET,
      region: "us-west-2"
    },
    senders:  {
      // transactional emails, register/forgot pass etc
      default:  {
        fromEmail: process.env.MAIL_FROM,
        fromName:  process.env.MAIL_FROM_NAME,
        signature: process.env.MAIL_SIGNATURE
      },
      // newsletters example
      informer: {
        fromEmail: process.env.MAIL_INFORMER_FROM,
        fromName:  process.env.MAIL_INFORMER_FROM_NAME,
        signature: process.env.MAIL_INFORMER_SIGNATURE
      }
    }
  }
};
