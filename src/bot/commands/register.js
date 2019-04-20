const usersModel = require('../../model/users')

const command = async ctx => {
  const username = ctx.state.from
  const chatId = ctx.message.chat.id
  try {
    await usersModel.create(username, chatId, false)
    ctx.reply(`Utilizador ${username} registado com sucesso`)
  } catch (e) {
    ctx.reply(`Foi encontrado um erro no registo do utilizador ${username}. O erro foi  '${e.message}'`)
  }
}

module.exports = command
