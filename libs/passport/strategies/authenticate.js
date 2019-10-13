import User from '../../../models/User'

const makeProviderId = (profile) => `${profile.provider}:${profile.id}`

export const authenticate = async (strategy, profile, done) => {

  const providerNameId = makeProviderId(profile)   // "facebook:123456"


  if (!email) {
    return done(null, false, 'Не указан email')
  }

  try {
    let user = await User.findOne({email})

    if (user) {
      return done(null, user)
    }

    user = await User.create({
      email, displayName,
    })

    done(null, user)
  } catch (err) {
    done(err)
  }
}
