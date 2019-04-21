const usersModel = require('../../model/users')

const middleware = mustBeUser => async (ctx, next) => {
  // console.log('calling check-register')
  const user = await usersModel.getByUsername(ctx.state.from)
  if (mustBeUser && !user) {
    ctx.reply('Para realizar este comando tens de estar registado no bot')
  } else if (!mustBeUser && user) {
    ctx.reply('Já estás registado no bot')
  } else {
    ctx.state.isAdmin = user.isAdmin
    next()
  }
}

module.exports = middleware
