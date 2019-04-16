const command = ctx => {
  ctx.reply(`Echoing ${ctx.state.command.args}`)
}

module.exports = command
