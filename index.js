const dotenv = require('dotenv');
const Telegraf = require('telegraf');
const Stage = require('telegraf/stage');
const session = require('telegraf/session');

dotenv.config();

const mainMenu = require('./scenes/mainMenu');
const cardMenuWithCard = require('./scenes/cardMenuWithCard');
const cardMenuWithoutCard = require('./scenes/cardMenuWithoutCard');
const addCard = require('./scenes/addCard');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage([mainMenu, cardMenuWithCard, cardMenuWithoutCard, addCard], { default: 'mainMenu' });

bot.use(session());
bot.use(stage.middleware());

bot.catch((err) => {
  console.error(err);
});

bot.start((ctx) => {
  ctx.scene.enter('mainMenu');
});

bot.launch()
  .then(() => {
    console.log('Telegram bot is running.');
  });
