const usersModel = require('../model/users')

const command = async ctx => {
  const username = ctx.state.from
  try {
    await usersModel.remove(username)
    ctx.reply(`Utilizador ${username} removido com sucesso`)
  } catch (e) {
    ctx.reply(`Foi encontrado um erro na remoção do utilizador ${username}. O erro foi  '${e.message}'`)
  }
}

module.exports = command
