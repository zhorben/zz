import User from '../models/User'
import { sendMail } from '../libs/sendMail'
import config from 'config'
import uuid4 from 'uuid4'
// import jwt from 'jsonwebtoken'
// import pick from 'lodash/pick'

const register = async (ctx) => {

  const verificationToken = uuid4()

  const {
    email, displayName,
    password
  } = ctx.request.body

  const user = new User({
    email: email.toLowerCase(),
    password,
    displayName,
    verificationToken,
    verifiedEmail: false
  })

  await user.setPassword(password)
  await user.save()

  await sendMail({
    to: user.email,
    subject: 'Подтвердите почту',
    template: 'confirmation',
    locals: {
      link: config.server.siteHost + '/confirm/' + verificationToken
    },
  })

  ctx.body = {
    status: 'ok'
  }
}

const confirm = async (ctx) => {
  const { verificationToken } = ctx.request.body

  const user = await User.findOne({ verificationToken })

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела')
  }

  if (!user.verifiedEmail) {
    user.verifiedEmail = true
  }

  user.verificationToken = undefined

  await user.save()

  ctx.body = { token: ctx.login(user) }
}

export default {
  register,
  confirm
}
