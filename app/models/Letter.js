import mongoose from 'mongoose'
import connection from '../libs/connection'

const schema = new mongoose.Schema({
  message: {},

  messageId: String, // from transport

  // lastSqsNotification: {  },

  transportResponse: {
    messageId: String,
    envelope: {},
    accepted: {},
    rejected: {},
    pending: {},
    response: String
  }

}, {
  timestamps: true
})

schema.index({ 'message.to.address': 1 }) // Message.find({'message.to.address': 'mail@mail.com'})
schema.index({ 'messageId': 1 })

export default connection.model('Letter', schema)