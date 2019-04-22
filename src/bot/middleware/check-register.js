const usersModel = require('../../model/users')

const middleware = mustBeUser => async (ctx, next) => {
  // console.log('calling check-register')
  const user = await usersModel.getByUsername(ctx.state.from)
  ctx.state.isAdmin = user && user.isAdmin
  if (mustBeUser && !user) {
    ctx.reply('Para realizar este comando tens de estar registado no bot')
  } else if (!mustBeUser && user) {
    ctx.reply('Já estás registado no bot')
  } else {
    next()
  }
}

module.exports = middleware
