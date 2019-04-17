const Extra = require('telegraf/extra')

const command = ctx => {
  const messages = [
    'Bem vindo ao Bot para Gestão ATL',
    'A lista de comandos é:',
    '/help - este mesmo comando! Igual a /start',
    '/start - este mesmo comando! Igual a /help',
    '/register - para te registares no bot',
    '/unregister - para te removeres do bot',
    '/log - para registares a tua alocação às releases. O bot vai perguntar-te a data, a release, o tipo de trabalho, e o número horas. Tenta garantir que registas apenas 8 horas por dia.',
    [
      '/getLogs - para obteres os teus registos. Podes correr este comando de 3 formas',
      '* sem parâmetros, e ele devolve-te todos os teus registos',
      '* com um data no formato YYYY-MM-DD, e ele devolve-te todos os teus registos desse dia',
      '* com duas datas no formato YYYY-MM-DD, e ele devolve-te todos os teus registos nesse intervalo'
    ].join('\n')
  ]
  ctx.reply(messages.join('\n\n'), Extra.HTML())
}

module.exports = command
