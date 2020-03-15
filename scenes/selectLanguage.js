const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');
const User = require('../dbModels/user');

const scene = new Scene('selectLanguage');

const menu = Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton('🇺🇿 O\'zbek', 'uz'), m.callbackButton('🇷🇺 Русский', 'ru')],
  ]));

scene.enter(async (ctx) => {
  await ctx.reply('Tilni tanlang/Выберите язык', menu);
});

scene.on('callback_query', async (ctx) => {
  const callbackQuery = ctx.update.callback_query;
  if (callbackQuery) {
    try {
      if (callbackQuery.data === 'uz' || callbackQuery.data === 'ru') {
        const lang = callbackQuery.data;
        await User.findOneAndUpdate({ telegramId: ctx.from.id }, { language: lang });
        ctx.i18n.locale(lang);
        await ctx.scene.enter('mainMenu');
      }
    } catch (e) {
      console.error(e);
    }
    await ctx.answerCbQuery();
  }
});

module.exports = scene;
