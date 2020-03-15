const Scene = require('telegraf/scenes/base');
const { match } = require('telegraf-i18n');

const { Extra } = require('telegraf');
const request = require('../frontol/request');
const User = require('../dbModels/user');

const scene = new Scene('addCard');

const menu = (ctx) => Extra
  .markup((m) => m.keyboard([m.callbackButton(ctx.i18n.t('common.back'))]).resize());

scene.enter(async (ctx) => {
  await ctx.reply(ctx.i18n.t('addCard.enterCardNumber'), menu(ctx));
});

scene.hears(match('common.back'), async (ctx) => {
  await ctx.reply(ctx.i18n.t('common.back'), Extra.markup((m) => m.removeKeyboard()));
  await ctx.scene.enter('mainMenu');
});

scene.on('text', async (ctx) => {
  try {
    const cardId = ctx.message.text;
    const clientDataRequest = await request({ url: `/client/${cardId}`, method: 'get' });
    const updatedUser = await User.findOneAndUpdate({ telegramId: ctx.from.id },
      { cardNumber: clientDataRequest.data.id });
    if (updatedUser) {
      await ctx.reply(ctx.i18n.t('addCard.cardAdded'));
      await ctx.scene.enter('cardMenuWithCard');
    }
  } catch (e) {
    if (e.response && e.response.status === 404) {
      ctx.reply(ctx.i18n.t('addCard.cardNotFound'));
      return;
    }
    console.error(e);
    ctx.reply(ctx.i18n.t('common.internalServerError'));
  }
});

module.exports = scene;
