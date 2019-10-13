import { Strategy as FacebookStrategy } from 'passport-facebook'
import authenticate from './authenticate'
import config from 'config'
import superagent from 'superagent'

export default new FacebookStrategy({
  clientID: config.providers.facebook.appId,
  clientSecret: config.providers.facebook.appSecret,
  callbackURL: config.server.siteHost + '/oauth/facebook',
  // fields are described here:
  // https://developers.facebook.com/docs/graph-api/reference/v2.7/user
  profileFields: ['id', 'about', 'email', 'gender', 'link', 'locale', 'timezone', 'name', 'photos'],
  session: false,
}, async (accessToken, refreshToken, profile, done) => {

  try {

    // facebook won't allow to use an email w/o verification
    if (!profile.emails || !profile.emails[0]) { // user may allow authentication, but disable email access (e.g in fb)
      throw new UserAuthError('При входе разрешите доступ к email. Он используется для идентификации пользователя.')
    }

    const response = await superagent.get(`http://graph.facebook.com/v2.7/${profile.id}/picture?redirect=0&width=1000&height=1000`)
    const photoData = response.data

    profile = {
      ...profile,
      displayName: `${profile.name.givenName} ${profile.name.familyName}`,
      photos: [{
        value: photoData.url,
        type: photoData.is_silhouette ? 'default' : 'photo'
      }]
    }
  
    authenticate('facebook', profile, done)

  } catch (err) {
    if (err instanceof UserAuthError) {
      done(null, false, { message: err.message })
    } else {
      done(err)
    }
  }
})
