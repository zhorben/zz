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
  providers: [{
    name:    String,
    nameId:  {
      type:  String,
      index: true
    },
    profile: {} // updates just fine if I replace it with a new value, w/o going inside
  }],
  passwordHash:  {
    type: String
  },
  // 'password' + 'afjahfkjhaklfjha7f687a6fa76' = 'sgsgs;jghsgs8g76s7'
  salt:          {
    type: String
  },
  verifyEmailToken: String,
  verifiedEmail: Boolean,
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

    this._plainPassword = password

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
  })
  .get(function() {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function(password) {
  if (!password) return false; // empty password means no login by password
  if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

  const passwordHash = crypto.pbkdf2Sync(
    password,
    this.salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'sha512'
  ).toString('base64');

  return passwordHash === this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);
