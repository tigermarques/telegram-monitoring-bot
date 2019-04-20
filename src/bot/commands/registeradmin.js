const usersModel = require('../../model/users')

const command = async ctx => {
  const username = ctx.state.from
  const chatId = ctx.message.chat.id
  const password = ctx.state.command.args
  try {
    if (password === process.env.ADMIN_PASSWORD) {
      await usersModel.create(username, chatId, true)
      ctx.reply(`Utilizador ${username} registado com sucesso`)
    } else {
      ctx.reply(`Password errada`)
    }
  } catch (e) {
    ctx.reply(`Foi encontrado um erro no registo do utilizador ${username}. O erro foi  '${e.message}'`)
  }
}

module.exports = command
