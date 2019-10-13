
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import authenticate from './authenticate'
import config from 'config'
import get from 'lodash/get'

export default new FacebookStrategy({
  clientID: config.providers.google.appId,
  clientSecret: config.providers.google.appSecret,
  callbackURL: config.server.siteHost + '/google/callback',
  // fields are described here:
  // https://developers.facebook.com/docs/graph-api/reference/v2.7/user
  profileFields: ['id', 'about', 'email', 'gender', 'link', 'locale', 'timezone', 'name', 'photos'],
  session: false,
}, (accessToken, refreshToken, profile, done) => {
  authenticate('facebook', get(profile, 'emails[0].value'), profile.displayName, done)
})

export default new GoogleStrategy({
    clientID:          config.providers.google.appId,
    clientSecret:      config.providers.google.appSecret,
    callbackURL:       config.server.siteHost + "/google/callback",
    passReqToCallback: true
  }, async function(req, accessToken, refreshToken, profile, done) {

    try {
      console.log(profile);

      let permissionError = null;
      // facebook won't allow to use an email w/o verification
      if (!profile.emails || !profile.emails[0]) { // user may allow authentication, but disable email access (e.g in fb)
        throw new UserAuthError("При входе разрешите доступ к email. Он используется для идентификации пользователя.");
      }

      profile.displayName = profile.name.givenName + " " + profile.name.familyName;

      authenticateByProfile(req, profile, done);
    } catch (err) {
      console.log(err);
      if (err instanceof UserAuthError) {
        done(null, false, {message: err.message});
      } else {
        done(err);
      }
    }
  }
);
