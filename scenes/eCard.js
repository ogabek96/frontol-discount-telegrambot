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
      const req = await request({ url: `/client/${user.cardNumber}`, method: 'get' });
      const canvas = createCanvas();
      JsBarcode(canvas, req.data.id);
      const image = canvas.toBuffer();
      await ctx.replyWithPhoto({
        source: image,
      });
    }
  } catch (e) {
    console.error(e);
    ctx.reply('Rasm yaratishda xatolk. Qaytadan urinib ko\'ring');
  }
  ctx.scene.enter('cardMenuWithCard');
});

module.exports = scene;
