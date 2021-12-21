const { Telegraf } = require("telegraf");
const axios = require("axios");
const cheerio = require("cheerio");
const bot = new Telegraf("2123698607:AAEINMnN39PUY0tz470a5QSMBj2UziDnqg4");
const needle = require("needle");

const getHtml = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};

bot.start((ctx) => {
  ctx.reply("ytn ns");
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

bot.command("timesheet", (ctx) => {
  ctx.reply("timesheet");
  const parseTimesheet = async () => {
    const URL = "http://109.237.0.203:8083/raspisanie/www/cg38.htm";
    needle.get(URL, function (err, res) {
      if (err) throw err;
      let a = cheerio.load(res.body);
      let abc = a("tr");
      let arr = [];
      let arr2 = [];
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
      // console.log(arr[0].slice(10, 12));
      // console.log(arr[6].slice(10, 12));
      // console.log(arr[12].slice(10, 12));
      // console.log(arr[18].slice(10, 12));
      // console.log(arr[24].slice(10, 12));
      // console.log(arr[23]);
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
      // arr2.push(arrTimesheet)
      // console.log(arrTimesheet[0]);
      // console.log(arrTimesheet[1]);
      // console.log(arrTimesheet[2]);
      // console.log(arrTimesheet[3]);
      // console.log(arrTimesheet[4]);
      // ctx.reply(toString(Object.keys(arrTimesheet[0][0])).replace(/"/, ""));
      // let str = Object.keys(arrTimesheet[0][0])
      // console.log(toString(str).replace(/"/, ""));
      /*
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
      */
      ctx.reply(
        JSON.stringify(Object.keys(arrTimesheet[0][0])).replace(/"/gi, "").slice(1, 3)
      );
      for (const key of arrTimesheet[0][0].Пн) {
        setTimeout(() => {
          ctx.reply(key);
        }, 1000);
        console.log(key);
      }
    });
  };
  parseTimesheet();
});

bot.on("message", (ctx) => {
  let key = ctx.update.message.text;
  console.log("key", key);
  switch (key) {
    case "пн":
      break;
    case "вт":
      break;
    case "ср":
      break;
    case "чт":
      break;
    case "пт":
      break;

    default:
      break;
  }
});

bot.launch().then(console.log("bot start"));
