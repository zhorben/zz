const defer = require('config/defer').deferConfig;
const path = require('path');
require('dotenv').config()

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: process.env.SECRET,
  jwtSecret: process.env.JWT_SECRET,
  server: {
    siteHost: process.env.SITE_HOST
  },
  root: process.cwd(),
  port: process.env.PORT,
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  mongoose: {
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  },
  crypto: {
    iterations: (process.env.NODE_ENV === 'production' ? 12000 : 1),
    length: 128,
    digest: 'sha512'
  },
  template: {
    // template.root uses config.root
    root: defer((cfg) => path.join(cfg.root, 'app/templates'))
  },
  providers: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
      // test: {
      //   login: 'course.test.facebook@gmail.com',
      //   password: 'course-test-facebook'
      // },
      options: {
        scope:   ['email']
      }
    },
    google: {
      appId: process.env.GOOGLE_APP_ID,
      appSecret: process.env.GOOGLE_APP_SECRET,
      options: {
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
