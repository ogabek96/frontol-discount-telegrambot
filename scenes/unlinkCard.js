const Scene = require('telegraf/scenes/base');
const User = require('../dbModels/user');

const scene = new Scene('unlinkCard');

scene.enter(async (ctx) => {
  const telegramId = ctx.from.id;
  try {
    await User.findOneAndUpdate({ telegramId }, { cardNumber: null });
  } catch (e) {
    console.error(e);
    ctx.reply(ctx.i18n.t('unlinkCard.cardUnlinkError'));
    return;
  }
  await ctx.reply(ctx.i18n.t('unlinkCard.cardUnlinked'));
  ctx.scene.enter('cardMenuWithoutCard');
});

module.exports = scene;
