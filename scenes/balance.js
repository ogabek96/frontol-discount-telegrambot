const Scene = require('telegraf/scenes/base');
const request = require('../frontol/request');
const User = require('../dbModels/user');

const scene = new Scene('balance');

scene.enter(async (ctx) => {
  const telegramId = ctx.update.callback_query.from.id;
  try {
    const user = await User.findOne({ telegramId });
    if (user) {
      const req = await request({ url: `/client/${user.cardNumber}`, method: 'get' });
      ctx.reply(`Sizning kartadagi balansingiz: ${req.data.bonus}`);
    }
  } catch (e) {
    console.error(e);
  }
  ctx.scene.enter('cardMenuWithCard');
});

module.exports = scene;
