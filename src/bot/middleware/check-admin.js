const usersModel = require('../../model/users')

const middleware = mustBeAdmin => async (ctx, next) => {
  // console.log('calling check-admin')
  const user = await usersModel.getByUsername(ctx.state.from)
  if (mustBeAdmin && !user.isAdmin) {
    ctx.reply('Para realizar este comando tens de ser administrador')
  } else if (!mustBeAdmin && user.isAdmin) {
    ctx.reply('Para realizar este comando não podes ser administrador')
  } else {
    ctx.state.isAdmin = user.isAdmin
    next()
  }
}

module.exports = middleware
