const Scene = require('telegraf/scenes/base');
const request = require('../frontol/request');
const User = require('../dbModels/user');

const scene = new Scene('balance');

scene.enter(async (ctx) => {
  const telegramId = ctx.from.id;
  try {
    const user = await User.findOne({ telegramId });
    if (user) {
      const clientDataRequest = await request({ url: `/client/${user.cardNumber}`, method: 'get' });
      await ctx.replyWithMarkdown(ctx.i18n.t('balance.yourBalance', { balance: clientDataRequest.data.bonus }));
    }
  } catch (e) {
    console.error(e);
  }
  await ctx.scene.enter('cardMenuWithCard');
});

module.exports = scene;
