const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');
const User = require('../dbModels/user');

const scene = new Scene('mainMenu');

const menu = (ctx) => Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton(ctx.i18n.t('mainMenu.cardMenu'), 'cardMenu')],
    [m.callbackButton(ctx.i18n.t('mainMenu.contact'), 'contact')],
    [m.callbackButton(ctx.i18n.t('mainMenu.selectLanguage'), 'selectLanguage')],
  ]));

scene.enter(async (ctx) => {
  await ctx.reply(ctx.i18n.t('mainMenu.welcomeMsg'), Extra.markup((m) => m.removeKeyboard()));
  await ctx.reply(ctx.i18n.t('mainMenu.youAreInMainMenu'), menu(ctx));
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
      case 'selectLanguage':
        ctx.scene.enter('selectLanguage');
        break;
      default:
        ctx.scene.enter('mainMenu');
    }
    ctx.answerCbQuery();
  }
});
module.exports = scene;
