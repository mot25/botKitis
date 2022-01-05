const {
  Telegraf,
  session,
  Scenes: { BaseScene, WizardScene, Stage },
  Markup,
} = require("telegraf");
const fs = require("fs");
const mysql = require("mysql");
const bot = new Telegraf("2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4");

const keyExit = Markup.keyboard(["exit"]).oneTime().resize();
const removeKeyboard = Markup.removeKeyboard();

const nameHendler = Telegraf.on("message", async (ctx) => {
  ctx.session.name = ctx.message.text;
  await ctx.reply("end scene 1", keyExit);
  return ctx.wizard.next();
});

const ageHandler = Telegraf.on("message", async (ctx) => {
  ctx.session.age = ctx.message.text;
  await ctx.reply("end scene 2", removeKeyboard);
  ctx.scene.leave();
});

const infoScene = new WizardScene("infoScene", nameHendler, ageHandler);
infoScene.enter((ctx) => ctx.reply("enter wizardScence", keyExit));
infoScene.leave(async (ctx) => {
  await fs.writeFileSync(
    "txt.txt",
    `yor name ${ctx.session.name} \n and\n age ${ctx.session.age}`
  );
  const conn = mysql.createConnection({
    host: "127.0.0.5",
    port: 3306,
    user: "root",
    database: "users",
    password: "root",
  });
  await conn.connect((err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("DB--ok");
    }
  });
  let queryInsert =
    "INSERT INTO users.new_table2 (`name`, `nametg`, `login`, `password`, `group`, `popular`, `love`) VALUES ('" +
    ctx.session.name +
    "', 'rrrrr', 'rrrr', '" +
    ctx.session.age +
    "', 'rrrrrr', '96', 'rrrr')";
  // let queryInsert = `insert  \`new_table\` (\`name\`, \`password\`) values (${ctx.session.name},  ${ctx.session.age}`;
  let query = "select * from new_table2";
  await conn.query(queryInsert, (err, res) => {
    if (err) {
      return console.log(err);
    }
    console.log(res);
  });
  await conn.end(async (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("DB--end");
      await ctx.reply("BD");
      await ctx.reply("👌");
    }
  });
  await ctx.reply("👌");
});
const stage = new Stage([infoScene]);
stage.hears("exit", (ctx) => ctx.scene.leave());
bot.use(session());
bot.use(stage.middleware());
bot.command("/start", (ctx) => {
  ctx.reply(`yor name ${ctx.session.name} \n and\n age ${ctx.session.age}`);
});
bot.command("bd", async (ctx) => {
  const conn = mysql.createConnection({
    host: "127.0.0.5",
    port: 3306,
    user: "root",
    database: "users",
    password: "root",
  });
  await conn.connect((err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("DB--ok");
    }
  });
  let queryInsert =
    "INSERT INTO users.new_table2 (`name`, `nametg`, `login`, `password`, `group`, `popular`, `love`) VALUES ('" +
    "proverka" +
    "', 'rrrrr', 'rrrr', 'rrrr', 'rrrrrr', '96', 'rrrr')";
  // let queryInsert = `insert  \`new_table\` (\`name\`, \`password\`) values (${ctx.session.name},  ${ctx.session.age}`;
  let query = "select * from new_table2";
  await conn.query(queryInsert, (err, res) => {
    if (err) {
      return console.log(err);
    }
    console.log(res);
  });
  await conn.end(async (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("DB--end");
      await ctx.reply("BD");
      await ctx.reply("👌");
    }
  });
});
bot.command("name", (ctx) => ctx.scene.enter("infoScene"));
bot.command("log", (ctx) => console.log(ctx.session));
bot.launch().then(console.log("start"));
