const Extra = require('telegraf/extra')
const usersModel = require('../../model/users')

const command = async ctx => {
  const user = await usersModel.getByUsername(ctx.message.from.username)
  const isAdmin = user && user.isAdmin
  const messages = [
    'Bem vindo ao Bot para Gestão ATL' + (isAdmin ? ' em modo admin' : ''),
    'A lista de comandos é:',
    '/help - este mesmo comando! Igual a /start',
    '/start - este mesmo comando! Igual a /help',
    '/register - para te registares no bot',
    '/unregister - para te removeres do bot',
    [
      '/log - para registares a tua alocação às releases. Podes correr este comando de 3 formas',
      '* sem parâmetros, e o bot vai perguntar-te a data, a release, o tipo de trabalho, e o número horas.',
      '* com a palavra \'today\', e o bot assume a data de hoje, e vai perguntar-te o resto da informação',
      '* com uma data no formato YYYY-MM-DD, e o bot assume essa data, e vai perguntar-te o resto da informação'
    ].join('\n'),
    isAdmin
      ? [
        '/getlogs - para obteres os teus registos ou de outra pessoa. Podes correr este comando de 3 formas',
        '* sem parâmetros, e ele devolve-te todos os registos do utilizador que escolheres',
        '* com uma data no formato YYYY-MM-DD, e ele devolve-te todos os registos desse dia do utilizador que escolheres',
        '* com duas datas no formato YYYY-MM-DD, e ele devolve-te todos os teus registos nesse intervalo do utilizador que escolheres'
      ].join('\n')
      : [
        '/getlogs - para obteres os teus registos. Podes correr este comando de 3 formas',
        '* sem parâmetros, e ele devolve-te todos os teus registos',
        '* com uma data no formato YYYY-MM-DD, e ele devolve-te todos os teus registos desse dia',
        '* com duas datas no formato YYYY-MM-DD, e ele devolve-te todos os teus registos nesse intervalo'
      ].join('\n'),
    isAdmin
      ? '/missing - para saberes as horas em falta de um utilizador'
      : '/missing - para saberes que horas tens em falta'
  ]
  if (isAdmin) {
    messages.push('/sendmessage - para enviares uma mensagem para um utilizador (ou para todos)')
    messages.push('/changesettings - para poderes actualizar as configurações do bot a partir do ficheiro de excel de gestão 0.Controlo.xlsm')
  }
  ctx.reply(messages.join('\n\n'), Extra.HTML())
}

module.exports = command
