import mongoose from 'mongoose'
import crypto from 'crypto'
import config from 'config'
import connection from '../libs/connection'

const userSchema = new mongoose.Schema({
  displayName:   {
    type:     String,
    required: "Имя пользователя отсутствует."
  },
  email:         {
    type:     String,
    unique:   "Такой email уже существует",
    required: "E-mail пользователя не должен быть пустым.",
    validate: [
      {
        validator: function checkEmail(value) {
          return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        msg:       'Укажите, пожалуйста, корректный email.'
      }
    ]
  },
  deleted: Boolean,
  gender: {
    type: String,
    enum: {
      values:  ['male', 'female'],
      message: "Неизвестное значение для пола."
    }
  },
  passwordHash:  {
    type: String
  },
  salt:          {
    type: String
  },
  verificationToken: String,
  verifiedEmail: Boolean,
}, {
  timestamps: true
});

const generatePassword = (salt, password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password, salt,
      config.crypto.iterations,
      config.crypto.length,
      config.crypto.digest,
      (err, key) => {
        if (err) return reject(err)
        resolve(key.toString('hex'))
      }
    )
  })
}

const generateSalt = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(config.crypto.length, (err, buffer) => {
      if (err) return reject(err)
      resolve(buffer.toString('hex'))
    })
  })
}

userSchema.methods.setPassword = async function setPassword(password) {
  this.salt = await generateSalt()
  this.passwordHash = await generatePassword(this.salt, password)
}

userSchema.methods.checkPassword = async function (password) {
  if (!password) return false

  const hash = await generatePassword(this.salt, password)
  return hash === this.passwordHash
}

userSchema.statics.publicFields = ['email', 'displayName']

export default connection.model('User', userSchema)
