const Scene = require('telegraf/scenes/base');
const { Extra } = require('telegraf');

const scene = new Scene('addCard');

const menu = Extra
  .markup((m) => m.keyboard([m.callbackButton('Orqaga')]).resize());

scene.enter((ctx) => {
  ctx.reply('Karta raqamini kiriting', menu);
});

scene.hears('Orqaga', (ctx) => {
  ctx.scene.enter('cardMenuWithoutCard');
});

scene.on('text', (ctx) => {
  const cardId = ctx.message.text;
});

module.exports = scene;
