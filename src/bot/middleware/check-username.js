const middleware = (ctx, next) => {
  // console.log('calling check-username')
  const username = ctx.message.from.username
  ctx.state.from = username
  if (!username) {
    ctx.reply('Parece que não tens username. Para usar este comando, o teu utilizador tem de ter um username de Telegram')
  } else {
    next()
  }
}

module.exports = middleware
