const birthdays = require("../../schemas/user");
const gBds = require("../../schemas/birthday");

/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
  setInterval(async () => {
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();

    const birthday = await birthdays.find();
    for (const birth of birthday) {
      const dateData = new Date(birth.birthday);
      const dateDay = dateData.getDay();
      const dateMonth = dateData.getMonth();
      if (day != dateDay && month != dateMonth) return;

      const inter = (m) => m.replace(/{mention}/g, `<@${birth.UserID}>`);

      const bData = await gBds.findOne({ GuildID: birth.GuildID });
      const channel = client.channels.cache.get(bData.ChannelID);
      return await channel.send(inter(bData.Message));
    }
  }, 8.64e7);
};
