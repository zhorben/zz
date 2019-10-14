import Letter from '../models/Letter'

import juice from 'juice'
import config from 'config'
import path from 'path'
import AWS from 'aws-sdk'
import pug from 'pug'
import nodemailer from 'nodemailer'
import { htmlToText } from 'nodemailer-html-to-text'
import stubTransport from 'nodemailer-stub-transport'
import SesTransport from 'nodemailer-ses-transport'
import SMTPTransport from 'nodemailer-smtp-transport'

AWS.config.update(config.mailer.aws)

export const transportEngine = (process.env.NODE_ENV === 'test' || process.env.MAILER_DISABLED)
  ? stubTransport()
  : config.mailer.transport === 'aws'
    ? new SesTransport({
        ses: new AWS.SES(),
        rateLimit: 50
      })
    : new SMTPTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: config.mailer.gmail.user,
          pass: config.mailer.gmail.password,
        }
      })

const transport = nodemailer.createTransport(transportEngine)

transport.use('compile', htmlToText())

/*
* sendMail - функция, отправляющая письмо на указанный адрес
* options - объект, содержащий опции для отправки писем:
* options.template - имя файла, содержащего шаблон письма
* options.locals - объект с переменными, которые будут переданы в шаблон
* options.to - email, на который будет отправлено письмо
* options.subject - тема письма
* пример:
*     await sendMail({
*       template: 'confirmation',
*       locals: {token: 'token'},
*       to: 'user@mail.com',
*       subject: 'Подтвердите почту',
*     });
* */
export const sendMail = async (options = {}) => {

  let sender = config.mailer.senders[options.from || 'default']

  const html = pug.renderFile(
    path.join(config.template.root, 'email', options.template) + '.pug',
    {
      sender,
      ...options.locals
    }
  )

  const message = {
    html: juice(html),
    to: {
      address: options.to,
    },
    subject: options.subject
    // from: {
    //   name: sender.fromName,
    //   address: sender.fromEmail
    // },
  }

  const transportResponse = await transport.sendMail(message)

  const letter = await Letter.create({
    message,
    transportResponse,
    messageId: transportResponse.messageId //.replace(/@email.amazonses.com$/, '')
  })

  return letter
}