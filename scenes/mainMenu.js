const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');
const User = require('../dbModels/user');

const scene = new Scene('mainMenu');

const menu = Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton('Marjon market kartasi', 'cardMenu')],
    [m.callbackButton('Aloqaga chiqish', 'contact')],
    [m.callbackButton('Tilni o\'zgartirish', 'selectLanguage')],
  ]));

scene.enter(async (ctx) => {
  await ctx.reply('Marjon market botiga xush kelibsiz', Extra.markup((m) => m.removeKeyboard()));
  await ctx.reply('Siz asosiy sahifadasiz', menu);
});

scene.on('callback_query', async (ctx) => {
  const callbackQuery = ctx.update.callback_query;
  if (callbackQuery) {
    const user = await User.findOne({ telegramId: callbackQuery.from.id });
    switch (callbackQuery.data) {
      case 'cardMenu':
        if (user.cardNumber) {
          ctx.scene.enter('cardMenuWithCard');
        } else {
          ctx.scene.enter('cardMenuWithoutCard');
        }
        break;
      case 'contact':
        ctx.scene.enter('contact');
        break;
      case 'changeLanguage':
        ctx.scene.enter('changeLanguage');
        break;
      default:
        ctx.scene.enter('mainMenu');
    }
    ctx.answerCbQuery();
  }
});

module.exports = scene;
