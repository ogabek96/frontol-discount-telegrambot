const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');

const scene = new Scene('cardMenuWithCard');

const menu = (ctx) => Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton(ctx.i18n.t('cardMenuWithCard.balance'), 'balance'), m.callbackButton('Elektron karta', 'eCard')],
    [m.callbackButton(ctx.i18n.t('common.information'), 'information')],
    [m.callbackButton(ctx.i18n.t('cardMenuWithCard.unlinkCard'), 'unlinkCard')],
    [m.callbackButton(ctx.i18n.t('common.backToMainMenu'), 'mainMenu')],
  ]));

scene.enter((ctx) => {
  ctx.reply(ctx.i18n.t('common.operationsWithCard'), menu(ctx));
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
