const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');

const scene = new Scene('cardMenuWithCard');

const menu = Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton('Qoldiq balans', 'balance'), m.callbackButton('Elektron karta', 'eCard')],
    [m.callbackButton('Tafsilotlar', 'information')],
    [m.callbackButton('Kartani botdan uzish', 'unlinkCard')],
    [m.callbackButton('Asosiy sahifaga qaytish', 'mainMenu')],
  ]));

scene.enter((ctx) => {
  ctx.reply('Karta bilan amaliyotlar bo\'limi', menu);
});

scene.on('callback_query', (ctx) => {
  const callbackQuery = ctx.update.callback_query;
  if (callbackQuery) {
    switch (callbackQuery.data) {
      case 'balance':
        ctx.scene.enter('balance');
        break;
      case 'eCard':
        ctx.scene.enter('eCard');
        break;
      case 'information':
        ctx.scene.enter('information');
        break;
      case 'unlinkCard':
        ctx.scene.enter('unlinkCard');
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
