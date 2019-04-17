const command = ctx => {
  const messages = [
    '<h2>Welcome to ATL Management Bot</h2>',
    '<br />',
    '<p>The list of commands are:</p>'
  ]
  ctx.replyWithHTML(messages.join(''))
}

module.exports = command
