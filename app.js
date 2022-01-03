const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const cheerio = require("cheerio");
const bot = new Telegraf("2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4");
const needle = require("needle");

const getHtml = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};
bot.start((ctx) => {
  ctx.reply(
    'Алоха друг, ты еще не зарегался, так регайся и войди',
    Markup.keyboard([
      ["reg", "enter"]
    ]).oneTime() .resize()
  );
});
bot.action("reg", async (ctx) => {
  
});
bot.help((ctx) => {
  ctx.reply("https://weather.rambler.ru/v-kaliningrade/");
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

bot.launch().then(console.log("bot start"));
