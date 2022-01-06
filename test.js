bot.command('profile', ctx => {
    ctx.reply(
        `
    login: ${ctx.session.login}
    password: ${ctx.session.password}
    group: ${ctx.session.group}
    `,
        removeKeyboard
      );
})