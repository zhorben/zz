const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('lodash');
const config = require('config');

const userSchema = new mongoose.Schema({
  displayName:   {
    type:     String,
    required: "Имя пользователя отсутствует."
  },
  email:         {
    type:     String,
    unique:   true,
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
  passwordHash:  {
    type: String,
    required: true
  },
  // 'password' + 'afjahfkjhaklfjha7f687a6fa76' = 'sgsgs;jghsgs8g76s7'
  salt:          {
    required: true,
    type: String
  }
}, {
  timestamps: true
});
/*
await User.create({
  displayName: 'Ivan',
  password: '123123'
})

await user = User.find({...});
user.password = '123456';
await user.save();
*/
userSchema.virtual('password')
  // https://www.npmjs.com/package/bcrypt
  .set(function(password) {

    if (password !== undefined) {
      if (password.length < 6) {
        this.invalidate('password', 'Пароль должен быть минимум 6 символов.');
      }
    }

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha512' // sha512
      ).toString('base64');
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  });

userSchema.methods.checkPassword = function(password) {
  if (!password) return false; // empty password means no login by password
  if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

  return crypto.pbkdf2Sync(
    password,
    this.salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'sha512'
  ).toString('base64') === this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);
