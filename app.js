const {
  Telegraf,
  session,
  Scenes: { WizardScene, Stage },
  Markup,
} = require("telegraf");
const axios = require("axios");
const cheerio = require("cheerio");
const bot = new Telegraf("2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4");
const needle = require("needle");
const mysql = require("mysql");
const fs = require("fs");

const getHtml = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};

const removeKeyboard = Markup.removeKeyboard();
const exitKeyboard = Markup.keyboard(["Exit"]).oneTime().resize();

bot.start((ctx) => {
  ctx.reply(
    "Алоха друг, ты еще не зарегался, так регайся и войди",
    Markup.keyboard([["reg", "enter"]])
      .oneTime()
      .resize()
  );
});

bot.help((ctx) => {
  ctx.reply("https://weather.rambler.ru/v-kaliningrade/");
});

bot.command("key", (ctx) => {
  // console.log('ctx', ctx)
});

const loginScenes = Telegraf.on("message", async (ctx) => {
  ctx.session.login = ctx.message.text;
  ctx.reply("Select password...", exitKeyboard);
  return ctx.wizard.next();
});
let arr = [
  "ИС 18-1",
  "ИС 18-2к",
  "ИСп 19-1",
  "ИСп 19-2к",
  "ИСп 20-1",
  "ИСп 20-2к",
  "ИСп 20-3к",
  "ИСп 20-4к",
  "ИСп 21-1",
  "ИСп 21-2к",
  "ИСр 19-1",
  "ИСр 19-2к",
  "ИСр 20-1",
  "ИСр 20-2к",
  "ИСр 21-1",
  "ИСр 21-2к",
  "М 19-1, М 19-2к",
  "М 20-1",
  "М 20-2к",
  "М 21-1",
  "М 21-2к",
  "С 18-1",
  "С 18-2, С 18-3к",
  "С 19-1",
  "С 19-2",
  "С 19-3к",
  "С 19-4к",
  "С 20-1",
  "С 20-2",
  "С 20-3, С 20-6к",
  "С 20-4к",
  "С 20-5к",
  "С 21-1",
  "С 21-2",
  "С 21-3",
  "С 21-4к",
  "СА 18-1, СА 18-2к",
  "СА 19-1",
  "СА 19-2к",
  "СА 20-1",
  "СА 20-2к",
  "СА 20-3к",
  "СА 21-1",
  "СА 21-2к",
  "СВ 19-1",
  "СВ 19-2к",
  "СВ 20-1",
  "СВ 20-2к",
  "СВ 20-3к",
  "СВ 21-1к",
  "СОД 20-1, СОД 20-2к",
  "СОД 21-1",
  "СОД 21-2к",
  "СОТ 19-1, СОТ 19-2к",
  "СПиЛС 19",
  "УМД 21-1",
];
const passwordScenes = Telegraf.on("message", async (ctx) => {
  ctx.session.password = ctx.message.text;
  await ctx.reply(
    "Select group...",
    Markup.keyboard(
      arr.map((item) => {
        return item;
      })
    )
      .oneTime()
      .resize()
  );
  return ctx.wizard.next();
});
const groupScenes = Telegraf.on("message", async (ctx) => {
  let flag = arr.some((elem) => elem == ctx.message.text);
  console.log("some");
  console.log(arr.some((elem) => elem == ctx.message.text));

  console.log("flag", flag);
  if (!flag) {
    console.log("---no group--");
    ctx.reply(
      "Вы ввели неправильную группу, повторите попытку зарегаться еще раз /start",
      removeKeyboard
    );
    ctx.session.loadBd = false;
  }
  ctx.session.group = ctx.message.text;
  return ctx.scene.leave();
});
const registrationScense = new WizardScene(
  "registrationScense",
  loginScenes,
  passwordScenes,
  groupScenes
);
registrationScense.enter(async (ctx) => {
  await ctx.reply("let's start the registration");
  await ctx.reply("Select login...", exitKeyboard);
  ctx.session.loadBd = true;
});
registrationScense.leave(async (ctx) => {
  // console.log(ctx.update.message.from.first_name);
  // console.log(ctx.update.message.from.username);
  const conn = mysql.createConnection({
    host: "127.0.0.5",
    user: "root",
    database: "users",
    password: "root",
  });
  if (ctx.session.loadBd) {
    await conn.connect((err) => {
      if (err) {
        return console.error(err);
      }
      console.log("DB--OK");
    });
    const query =
      "INSERT INTO `users`.`new_table2` (`name`, `nametg`, `login`, `password`, `group`) VALUES ('" +
      ctx.update.message.from.first_name +
      "', '" +
      ctx.update.message.from.username +
      "', '" +
      ctx.session.login +
      "', '" +
      ctx.session.password +
      "', '" +
      ctx.session.group +
      "')";
    await conn.query(query, (err, result) => {
      if (err) console.log(err);
      console.log(result);
    });
    await conn.end((err) => {
      if (err) {
        return console.error(err);
      }
      console.log("DB--CLOSE");
    });
    ctx.reply(
      `
  login: ${ctx.session.login}
  password: ${ctx.session.password}
  group: ${ctx.session.group}
  `,
      removeKeyboard
    );
  }
});
const stage = new Stage([registrationScense]);
stage.hears("Exit", (ctx) => ctx.scene.leave());
bot.use(session());
bot.use(stage.middleware());

bot.hears("reg", async (ctx) => {
  const conn = mysql.createConnection({
    host: "127.0.0.5",
    user: "root",
    database: "users",
    password: "root",
  });

  await conn.connect((err) => {
    if (err) {
      return console.error(err);
    }
    console.log("DB--OK");
  });
  const query = `select id, nametg from new_table2 where nametg = '${ctx.update.message.from.username}' `;
  await conn.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    console.log(result.length);
  });
  await conn.end((err) => {
    if (err) {
      return console.error(err);
    }
    console.log("DB--CLOSE");
  });
  if (ctx.session.lastlog) {
    return ctx.reply(
      `
  С этого аккаунта была уже регистрация
    `,
      removeKeyboard
    );
  }

  await ctx.scene.enter("registrationScense");
});

bot.hears("enter", (ctx) => {
  ctx.reply("enter");
  console.log(ctx.session.login);
});

bot.command("/profile", (ctx) => {
  ctx.reply(
    `
  login: ${ctx.session.login}
  password: ${ctx.session.password}
  group: ${ctx.session.group}
  `,
    removeKeyboard
  );
});

// bot.on("message", (ctx, next) => {
//   console.log(ctx.message.text);
//   return next();
// });

bot.hears("Цикады 3301", async (ctx) => {
  let srtArr = [];
  ctx.reply("https://github.com/mot25/botKitis.git");
  // await fs.readFile("txt.txt", "utf8", function (error, data) {
  //   console.log("Асинхронное чтение файла");
  //   if (error) throw error;
  //   srtArr = data.split("bot");
  // });
  // setTimeout(async () => {
  //   console.log(srtArr);
  //   for (let i = 0; i < srtArr.length; i++) {
  //     await ctx.reply(srtArr[i]);
  //   }
  // }, 20000);
});

bot.command("pogoda", (ctx) => {
  const parseWeather = async () => {
    const $ = await getHtml("https://weather.rambler.ru/v-kaliningrade/");
    let numPog = Number($("div._1HBR").text()[0]);
    console.log("numPog ->", numPog);
    ctx.reply(`
        ${$("div._1HBR").first().text()}
    ${$("div.Hixd").text()}
        `);
  };
  parseWeather();
});

bot.command("timesheet", async (ctx) => {
  ctx.reply(
    "whats mode",
    Markup.inlineKeyboard([
      Markup.button.callback("full", "full"),
      Markup.button.callback("day", "day"),
    ])
  );
});

bot.action("full", async (ctx) => {
  const parseTimesheet = async () => {
    const URL = "http://109.237.0.203:8083/raspisanie/www/cg38.htm";
    needle.get(URL, function async(err, res) {
      if (err) throw err;
      let a = cheerio.load(res.body);
      let abc = a("tr");
      let arr = [];
      let arrTimesheet;

      abc.each((i, e) => {
        if (
          (i > 11) &
          (i < 47) &
          (i !== 18) &
          (i !== 25) &
          (i !== 32) &
          (i !== 39) &
          (i !== 46)
        ) {
          // date 12 19 26 33 40
          arr.push(a(e).text());
        }
      });
      arrTimesheet = [
        [
          {
            [arr[0].slice(10, 12)]: [
              arr[0].slice(12, 120),
              arr[1],
              arr[2],
              arr[3],
              arr[4],
              arr[5],
            ],
          },
        ],
        [
          {
            [arr[6].slice(10, 12)]: [
              arr[6].slice(12, 120),
              arr[7],
              arr[8],
              arr[9],
              arr[10],
              arr[11],
            ],
          },
        ],
        [
          {
            [arr[12].slice(10, 12)]: [
              arr[12].slice(12, 120),
              arr[13],
              arr[14],
              arr[15],
              arr[16],
              arr[17],
            ],
          },
        ],
        [
          {
            [arr[18].slice(10, 12)]: [
              arr[18].slice(12, 120),
              arr[19],
              arr[20],
              arr[21],
              arr[22],
              arr[23],
            ],
          },
        ],
        [
          {
            [arr[24].slice(10, 12)]: [
              arr[24].slice(12, 120),
              arr[25],
              arr[26],
              arr[27],
              arr[28],
              arr[29],
            ],
          },
        ],
      ];

      async function fun(arrTimesheet) {
        await ctx.reply(
          JSON.stringify(Object.keys(arrTimesheet[0][0]))
            .replace(/"/gi, "")
            .slice(1, 3)
        );
        for (const key of arrTimesheet[0][0].Пн) {
          await ctx.reply(key);
        }

        await ctx.reply(
          JSON.stringify(Object.keys(arrTimesheet[1][0]))
            .replace(/"/gi, "")
            .slice(1, 3)
        );
        for (const key of arrTimesheet[1][0].Вт) {
          await ctx.reply(key);
        }

        await ctx.reply(
          JSON.stringify(Object.keys(arrTimesheet[2][0]))
            .replace(/"/gi, "")
            .slice(1, 3)
        );
        for (const key of arrTimesheet[2][0].Ср) {
          await ctx.reply(key);
        }

        await ctx.reply(
          JSON.stringify(Object.keys(arrTimesheet[3][0]))
            .replace(/"/gi, "")
            .slice(1, 3)
        );
        for (const key of arrTimesheet[3][0].Чт) {
          await ctx.reply(key);
        }

        await ctx.reply(
          JSON.stringify(Object.keys(arrTimesheet[4][0]))
            .replace(/"/gi, "")
            .slice(1, 3)
        );
        for (const key of arrTimesheet[4][0].Пт) {
          await ctx.reply(key);
        }
      }
      fun(arrTimesheet);
    });
  };
  parseTimesheet();
});

bot.on("message", async (ctx, next) => {
  // Markup.removeKeyboard()
  let key = ctx.update.message.text;
  const parseTimesheet = async () => {
    const URL = "http://109.237.0.203:8083/raspisanie/www/cg38.htm";
    needle.get(URL, function async(err, res) {
      if (err) throw err;
      let a = cheerio.load(res.body);
      let abc = a("tr");
      let arr = [];
      let arrTimesheet;

      abc.each((i, e) => {
        if (
          (i > 11) &
          (i < 47) &
          (i !== 18) &
          (i !== 25) &
          (i !== 32) &
          (i !== 39) &
          (i !== 46)
        ) {
          // date 12 19 26 33 40
          arr.push(a(e).text());
        }
      });
      arrTimesheet = [
        [
          {
            [arr[0].slice(10, 12)]: [
              arr[0].slice(12, 120),
              arr[1],
              arr[2],
              arr[3],
              arr[4],
              arr[5],
            ],
          },
        ],
        [
          {
            [arr[6].slice(10, 12)]: [
              arr[6].slice(12, 120),
              arr[7],
              arr[8],
              arr[9],
              arr[10],
              arr[11],
            ],
          },
        ],
        [
          {
            [arr[12].slice(10, 12)]: [
              arr[12].slice(12, 120),
              arr[13],
              arr[14],
              arr[15],
              arr[16],
              arr[17],
            ],
          },
        ],
        [
          {
            [arr[18].slice(10, 12)]: [
              arr[18].slice(12, 120),
              arr[19],
              arr[20],
              arr[21],
              arr[22],
              arr[23],
            ],
          },
        ],
        [
          {
            [arr[24].slice(10, 12)]: [
              arr[24].slice(12, 120),
              arr[25],
              arr[26],
              arr[27],
              arr[28],
              arr[29],
            ],
          },
        ],
      ];
      switch (key) {
        case "пн":
          async function fun(arrTimesheet) {
            await ctx.reply(
              JSON.stringify(Object.keys(arrTimesheet[0][0]))
                .replace(/"/gi, "")
                .slice(1, 3)
            );
            for (const key of arrTimesheet[0][0].Пн) {
              await ctx.reply(key);
            }
          }
          fun(arrTimesheet);

          break;
        case "вт":
          async function fun1(arrTimesheet) {
            await ctx.reply(
              JSON.stringify(Object.keys(arrTimesheet[1][0]))
                .replace(/"/gi, "")
                .slice(1, 3)
            );
            for (const key of arrTimesheet[1][0].Вт) {
              await ctx.reply(key);
            }
          }
          fun1(arrTimesheet);
          break;
        case "ср":
          async function fun2(arrTimesheet) {
            await ctx.reply(
              JSON.stringify(Object.keys(arrTimesheet[2][0]))
                .replace(/"/gi, "")
                .slice(1, 3)
            );
            for (const key of arrTimesheet[2][0].Ср) {
              await ctx.reply(key);
            }
          }
          fun2(arrTimesheet);
          break;
        case "чт":
          async function fun3(arrTimesheet) {
            await ctx.reply(
              JSON.stringify(Object.keys(arrTimesheet[3][0]))
                .replace(/"/gi, "")
                .slice(1, 3)
            );
            for (const key of arrTimesheet[3][0].Чт) {
              await ctx.reply(key);
            }
          }
          fun3(arrTimesheet);
          break;
        case "пт":
          async function fun4(arrTimesheet) {
            await ctx.reply(
              JSON.stringify(Object.keys(arrTimesheet[4][0]))
                .replace(/"/gi, "")
                .slice(1, 3)
            );
            for (const key of arrTimesheet[4][0].Пт) {
              await ctx.reply(key);
            }
          }
          fun4(arrTimesheet);

          break;

        default:
          break;
      }
    });
  };
  await parseTimesheet();
  return next();
});

bot.action("day", (ctx) => {
  ctx.reply(
    "select day",
    Markup.keyboard([["пн", "вт", "ср", "чт", "пт"]])
      .resize()
      .oneTime()
  );
});

bot.command("getmin", (ctx) => {
  const abc = (h, m = 0) => {
    return h * 60 + m;
  };
  let min = abc(new Date().getHours(), new Date().getMinutes());
  if (min > 1120 || min < 510) {
    ctx.reply("Пора домой");
    return false;
  }
  const arrMin = [
    510, 600, 610, 700, 730, 820, 830, 920, 930, 1020, 1030, 1120,
  ];
  let filt = arrMin.filter((item) => {
    return item < min;
  });
  let numArrOne = filt.length;
  ctx.reply(arrMin[numArrOne] - min);
  const getMin = (h, m) => {
    const date = new Date();
    const getHours = date.getHours();
    const getMinutes = date.getMinutes();
    let valMin = getHours * 60 + getMinutes;
    let willDate = h * 60 + m - valMin;
    return willDate;
  };
});

bot.command("ready", async (ctx) => {
  await ctx.reply("ready");
});

bot.launch().then(console.log("bot start"));
