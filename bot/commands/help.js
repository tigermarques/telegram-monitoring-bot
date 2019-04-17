const command = ctx => {
  const messages = [
    '<p>Welcome to ATL Management Bot</p>',
    '<p>The list of commands are:</p>'
  ]
  ctx.replyWithHTML(messages.join(''))
}

module.exports = command
