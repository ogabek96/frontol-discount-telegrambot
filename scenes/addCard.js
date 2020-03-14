const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');
const request = require('../frontol/request');

const scene = new Scene('addCard');

const menu = Extra
  .markup((m) => m.keyboard([m.callbackButton('Orqaga')]).resize());

scene.enter((ctx) => {
  ctx.reply('Karta raqamini kiriting', menu);
});

scene.hears('Orqaga', (ctx) => {
  ctx.scene.enter('mainMenu');
});

scene.on('text', async (ctx) => {
  try {
    const cardId = ctx.message.text;
    const req = await request({ url: `/client/${cardId}`, method: 'get' });
  } catch (e) {
    if (e.response && e.response.status === 404) {
      ctx.reply('Karta topilmadi');
      return;
    }
    console.error(e);
    ctx.reply('Serverda ichki xatolik. Iltimos qaytadan urinib ko\'ring');
  }
});

module.exports = scene;
