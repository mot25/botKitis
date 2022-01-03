const { Telegraf, Markup } = require('telegraf')
const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')

const bot = new Telegraf('2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4')


bot.command('profile', async (ctx) => {
  return await ctx.reply('Custom buttons keyboard', Markup
    .keyboard([
      ['Регистрация', 'Войти'], 
    ])
    .oneTime()
    .resize()
  )
})
bot.launch().then(console.log('bot start'))