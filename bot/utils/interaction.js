const InteractionManager = require('./InteractionManager')

const Interaction = class Interaction {
  static create (bot, chatId) {
    if (InteractionManager.has(chatId, 'callback_query')) {
      return null
    } else {
      return new Interaction(bot, chatId)
    }
  }

  constructor (bot, chatId) {
    this.bot = bot
    this.chatId = chatId
    this.messages = []
    this.currentPromiseResolve = null
    this.currentPromiseReject = null
    this.handlers = []

    this.handlers.push(InteractionManager.on(this.chatId, 'callback_query', data => {
      this.messages.push({
        type: 'user_reply',
        data: data
      })
      this.bot.answerCallbackQuery(data.id)
      this.bot.deleteMessage(data.message.chat.id, data.message.message_id)
      this.currentPromiseResolve(data)
      this.currentPromiseResolve = null
      this.currentPromiseReject = null
    }))

    this.handlers.push(InteractionManager.on(this.chatId, 'text', data => {
      this.messages.push({
        type: 'user_reply',
        data: data
      })
      this.currentPromiseResolve(data)
      this.currentPromiseResolve = null
      this.currentPromiseReject = null
    }))
  }

  send (text, options) {
    return new Promise((resolve, reject) => {
      this.currentPromiseResolve = resolve
      this.currentPromiseReject = reject
      return this.bot.sendMessage(this.chatId, text, options)
        .then(message => {
          this.messages.push({
            type: 'bot_message',
            data: message
          })
        })
        .catch(reject)
    })
  }

  end () {
    for (let i = 0; i < this.handlers.length; i++) {
      this.handlers[i].remove()
    }
    return this.messages
  }
}

module.exports = Interaction
