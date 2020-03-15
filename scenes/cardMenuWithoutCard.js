const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');

const scene = new Scene('cardMenuWithoutCard');

const menu = (ctx) => Extra
  .markup((m) => m.inlineKeyboard([
    [m.callbackButton(ctx.i18n.t('cardMenuWithoutCard.addCard'), 'addCard')],
    [m.callbackButton(ctx.i18n.t('common.information'), 'information')],
    [m.callbackButton(ctx.i18n.t('common.backToMainMenu'), 'mainMenu')],
  ]));

scene.enter((ctx) => {
  ctx.reply(ctx.i18n.t('common.operationsWithCard'), menu(ctx));
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
