const User = require('../../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authenticateByProfile = require('./authenticateByProfile');
const config = require('config');
const request = require('request-promise');

function UserAuthError(message) {
  this.message = message;
}
/*
  OAuth2,

  website -> facebook (clientID, clientSecret) -> website (code) (|)

      code -> request(code) -> access_token -> requestFacebookAPI(access_token) ->
      profile

  -> website (welcome)

*/
module.exports = new GoogleStrategy({
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
