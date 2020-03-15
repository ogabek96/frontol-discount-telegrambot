const Scene = require('telegraf/scenes/base');
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const request = require('../frontol/request');
const User = require('../dbModels/user');

const scene = new Scene('eCard');

scene.enter(async (ctx) => {
  const telegramId = ctx.from.id;
  try {
    const user = await User.findOne({ telegramId });
    if (user) {
      const clientDataRequest = await request({ url: `/client/${user.cardNumber}`, method: 'get' });
      const canvas = createCanvas();
      JsBarcode(canvas, clientDataRequest.data.id);
      const image = canvas.toBuffer();
      await ctx.replyWithPhoto({
        source: image,
      });
    }
  } catch (e) {
    console.error(e);
    ctx.reply(ctx.i18.t('eCard.imageError'));
  }
  ctx.scene.enter('cardMenuWithCard');
});

module.exports = scene;
