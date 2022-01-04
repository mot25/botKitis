const {
  Telegraf,
  session,
  Scenes: { BaseScene, Stage },
  Markup,
} = require("telegraf");

const bot = new Telegraf("2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4");

const nameScene = new BaseScene("nameScene");

nameScene.enter((ctx) => ctx.reply("whats your name?"));
nameScene.on("text", (ctx) => {
  ctx.session.name = ctx.message.text;
  return ctx.scene.leave();
});

nameScene.leave((ctx) => ctx.reply("new name scene save"));

const ageScene = new BaseScene("ageScene");
ageScene.enter((ctx) => ctx.reply("whats your age?"));
ageScene.on("text", (ctx) => {
  ctx.session.name = ctx.message.text;
  return ctx.scene.leave();
});

ageScene.leave((ctx) => ctx.reply("new ageScene scene save"));

const stage = new Stage([nameScene, ageScene]);

bot.use(session());
bot.use(stage.middleware());
bot.command("/start", (ctx) =>
  ctx.reply(`yor name ${ctx.session.name} and age ${ctx.session.age}`)
);
bot.command("name", (ctx) => ctx.scene.enter("nameScene"));
bot.command("/age", (ctx) => ctx.scene.enter("ageScene"));

bot.launch().then(console.log("start"));
