const {
  Telegraf,
  session,
  Scenes: { BaseScene, Stage },
  Markup,
} = require("telegraf");

const bot = new Telegraf("2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4");

const keyExit = Markup.keyboard(["exit"]).oneTime().resize();
const removeKeyboard = Markup.removeKeyboard();

const nameScene = new BaseScene("nameScene");
nameScene.enter((ctx) => ctx.reply("whats your name?", keyExit));
nameScene.on("text", (ctx) => {
  ctx.reply("new name scene save", removeKeyboard);
  ctx.scene.enter("ageScene", { name: ctx.message.text });
  return ctx.scene.leave();
});
nameScene.leave((ctx) => ctx.reply("exit scene1"));

const ageScene = new BaseScene("ageScene");
ageScene.enter((ctx) => ctx.reply("whats your age?", keyExit));
ageScene.on("text", (ctx) => {
  ctx.session.name = ctx.scene.state.name;
  ctx.session.age = ctx.message.text;
  ctx.reply("new ageScene scene save", removeKeyboard);
  return ctx.scene.leave();
});
ageScene.leave((ctx) => {
  ctx.reply("exit scene2");
  ctx.reply(`yor name ${ctx.session.name} and age ${ctx.session.age}`);
});

const stage = new Stage([nameScene, ageScene]);
stage.hears("exit", (ctx) => ctx.scene.leave());
bot.use(session());
bot.use(stage.middleware());
bot.command("/start", (ctx) => {
  ctx.reply(`yor name ${ctx.session.name} and age ${ctx.session.age}`);
});
bot.command("name", (ctx) => ctx.scene.enter("nameScene"));
bot.command("/age", (ctx) => ctx.scene.enter("ageScene"));
bot.launch().then(console.log("start"));
