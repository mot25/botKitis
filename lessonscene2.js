const {
  Telegraf,
  session,
  Scenes: { BaseScene, Stage },
  Markup,
} = require("telegraf");

const bot = new Telegraf("2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4");



const nameScene = new BaseScene("nameScene");
const ageScene = new BaseScene("ageScene");

nameScene.enter((ctx) => ctx.reply("whats your name"));
nameScene.on("text", async (ctx) => {
  ctx.session.name = ctx.message.text;
  await ctx.reply("save name");
  ctx.scene.leave();
});
nameScene.leave((ctx) => {
  ctx.scene.enter("ageScene");
});
ageScene.enter((ctx) => {
  ctx.reply("how many yars");
});
ageScene.on("text", async (ctx) => {
  ctx.session.age = ctx.message.text;
  ctx.reply("save age");
  ctx.scene.leave();
});
ageScene.leave((ctx) => {
  ctx.reply("press /readyprofile");
});

const stage = new Stage([nameScene, ageScene]);
bot.use(session());
bot.use(stage.middleware());

bot.command("profile", (ctx) => {
  ctx.scene.enter("nameScene");
});
bot.command("readyprofile", (ctx) => {
  ctx.reply(`${ctx.session.name} and ${ctx.session.age}`);
});

bot.launch().then(console.log("start"));

