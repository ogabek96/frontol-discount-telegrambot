require('dotenv').config();
const Telegraf = require('telegraf');
const express = require('express');
const TelegrafI18n = require('telegraf-i18n');
const Stage = require('telegraf/stage');
const session = require('telegraf/session');

const expressApp = express();

const { URL, BOT_TOKEN } = process.env;
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
console.log(process.env);
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}`,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  }).then(() => {
  console.log('Successfully connected to MongoDb');
}).catch((e) => console.error(e));

const User = require('./dbModels/user');

const selectLanguage = require('./scenes/selectLanguage');
const mainMenu = require('./scenes/mainMenu');
const cardMenuWithCard = require('./scenes/cardMenuWithCard');
const balance = require('./scenes/balance');
const eCard = require('./scenes/eCard');
const unlinkCard = require('./scenes/unlinkCard');
const cardMenuWithoutCard = require('./scenes/cardMenuWithoutCard');
const addCard = require('./scenes/addCard');

const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
expressApp.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));

const i18n = new TelegrafI18n({
  useSession: true,
  defaultLanguageOnMissing: true,
  defaultLanguage: 'ru',
  directory: `${__dirname}/locales`,
});

const stage = new Stage([selectLanguage, mainMenu,
  cardMenuWithCard, balance, eCard, unlinkCard, cardMenuWithoutCard, addCard]);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

bot.catch((err) => {
  console.error(err);
});

bot.use(async (ctx, next) => {
  const telegramId = ctx.from.id;
  try {
    const user = await User.findOne({ telegramId });
    if (!user) {
      await User.create({ telegramId });
    }

    if (user && user.language) {
      ctx.i18n.locale(user.language);
      await ctx.scene.enter('mainMenu');
      return;
    }
  } catch (e) {
    console.error(e);
  }
  ctx.scene.enter('selectLanguage');
  next();
});

expressApp.listen(PORT, () => {
  console.log('Telegram bot is running');
});
