import { Strategy as FacebookStrategy } from 'passport-facebook'
import authenticate from './authenticate'
import config from 'config'
import get from 'lodash/get'

export default new FacebookStrategy({
  clientID: config.providers.facebook.appId,
  clientSecret: config.providers.facebook.appSecret,
  callbackURL: config.server.siteHost + '/oauth/facebook',
  profileFields: ['email', 'gender', 'displayName'],
  session: false,
}, (accessToken, refreshToken, profile, done) => {
  authenticate('facebook', get(profile, 'emails[0].value'), profile.displayName, done);
})
