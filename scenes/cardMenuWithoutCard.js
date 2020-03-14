const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');

const scene = new Scene('cardMenuWithoutCard');

const menu = Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton('Kartani qo\'shish', 'addCard')],
    [m.callbackButton('Tafsilotlar', 'information')],
    [m.callbackButton('Asosiy sahifaga qaytish', 'mainMenu')],
  ]));

scene.enter((ctx) => {
  ctx.reply('Karta bilan amaliyotlar bo\'limi', menu);
});

scene.on('callback_query', (ctx) => {
  const callbackQuery = ctx.update.callback_query;
  if (callbackQuery) {
    switch (callbackQuery.data) {
      case 'addCard':
        ctx.scene.enter('addCard');
        break;
      case 'mainMenu':
        ctx.scene.enter('mainMenu');
        break;
      default:
        ctx.scene.enter('mainMenu');
    }
    ctx.answerCbQuery();
  }
});
module.exports = scene;
