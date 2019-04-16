const InteractionManager = (function () {
  const allowedTypes = ['message', 'text', 'audio', 'document', 'photo',
    'sticker', 'video', 'voice', 'contact', 'location', 'new_chat_members',
    'left_chat_member', 'new_chat_title', 'new_chat_photo', 'delete_chat_photo',
    'group_chat_created', 'game', 'pinned_message', 'migrate_from_chat_id',
    'migrate_to_chat_id', 'channel_chat_created', 'supergroup_chat_created',
    'successful_payment', 'invoice', 'video_note', 'callback_query'/* ,
    'inline_query', 'chosen_inline_result', 'channel_post', 'edited_message',
    'edited_message_text', 'edited_message_text', 'edited_channel_post',
    'edited_channel_post_text', 'edited_channel_post_caption', 'shipping_query',
    'pre_checkout_query', 'polling_error', 'webhook_error', 'error' */]

  const interactions = {}
  return {
    setup: bot => {
      allowedTypes.forEach(type => {
        bot.on(type, data => {
          const chatId = type === 'callback_query' ? data.message.chat.id : data.chat.id
          if (chatId in interactions && type in interactions[chatId]) {
            interactions[chatId][type](data)
          }
        })
      })
    },

    on: (chatId, type, handler) => {
      if (allowedTypes.indexOf(type) === -1) {
        throw new Error(`Event ${type} not supported`)
      }
      if (!(chatId in interactions)) {
        interactions[chatId] = {}
      }
      if (type in interactions[chatId]) {
        throw new Error(`Already listening to ${type} event for this chat`)
      }
      interactions[chatId][type] = handler
      return {
        remove: () => {
          delete interactions[chatId][type]
        }
      }
    },

    has: (chatId, type) => {
      return (chatId in interactions && type in interactions[chatId])
    }
  }
}())

module.exports = InteractionManager
