require('dotenv').config();
const Telegraf = require('telegraf');
const Stage = require('telegraf/stage');
const session = require('telegraf/session');

const mongoose = require('mongoose');

// mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}
mongoose.connect(`mongodb://${process.env.MONGODB_HOST}`,
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

const mainMenu = require('./scenes/mainMenu');
const cardMenuWithCard = require('./scenes/cardMenuWithCard');
const balance = require('./scenes/balance');
const eCard = require('./scenes/eCard');
const cardMenuWithoutCard = require('./scenes/cardMenuWithoutCard');
const addCard = require('./scenes/addCard');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage([mainMenu, cardMenuWithCard, balance, eCard, cardMenuWithoutCard, addCard], { default: 'mainMenu' });

bot.use(session());
bot.use(stage.middleware());

bot.catch((err) => {
  console.error(err);
});

bot.start(async (ctx) => {
  const telegramId = ctx.update.message.from.id;
  try {
    const user = await User.findOne({ telegramId });
    if (!user) {
      await User.create({ telegramId });
    }
  } catch (e) {
    console.error(e);
  }
  ctx.scene.enter('mainMenu');
});

bot.launch()
  .then(() => {
    console.log('Telegram bot is running.');
  });
