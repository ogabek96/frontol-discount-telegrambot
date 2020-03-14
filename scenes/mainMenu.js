const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');

const scene = new Scene('mainMenu');

const menu = Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton('Marjon market kartasi', 'cardMenuWithCard')],
    [m.callbackButton('Aloqaga chiqish', 'contact')],
    [m.callbackButton('Tilni o\'zgartirish', 'changeLanguage')],
  ]));

scene.enter((ctx) => {
  ctx.reply('Siz asosiy sahifadasiz', menu);
});

scene.on('callback_query', (ctx) => {
  const callbackQuery = ctx.update.callback_query;
  if (callbackQuery) {
    switch (callbackQuery.data) {
      case 'cardMenuWithCard':
        ctx.scene.enter('cardMenuWithoutCard');
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
