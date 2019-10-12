const oid = require('../libs/oid');
require('../models/user');

exports.User = [{
  _id:      oid('user-arthur'),
  email:    "arthurzherko@gmail.com",
  displayName: 'Mr. Arthur',
  password: '123456'
}, {
  _id:      oid('user-iliakan'),
  email:    "iliakan@javascript.ru",
  displayName: 'iliakan',
  password: '123456'
}];
