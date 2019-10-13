import { Strategy as LocalStrategy } from 'passport-local'
import User from '../../../models/User'

// Стратегия берёт поля из req.body
// Вызывает для них функцию
export default new LocalStrategy({
    usernameField: 'email', // 'username' by default
    session: false
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      
      if (!user) {
        return done(null, false, 'Нет такого пользователя')
      }
      
      const isValidPassword = await user.checkPassword(password)
      
      if (!isValidPassword) {
        return done(null, false, 'Невереный пароль')
      }
      
      // if (user.verificationToken) {
      //   return done(null, false, 'Подтвердите email')
      // }
      
      return done(null, user)
    } catch (err) {
      done(err)
    }
  }
)
