const { Client, Message } = require("discord.js");
const user = require("../../schemas/user");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;

  const { guildId, author } = message;

  const res = client.cache.get(`afk-${guildId}-${author.id}`);
  let data;
  if (res) {
    data = res;
  } else {
    data = await user.findOne({ GuildID: guildId, UserID: author.id });
    if (!data) return;
    client.cache.set(`afk-${guildId}-${author.id}`, data);
  }

  if (!data.afk.isAFK) return;
  await user.findOneAndUpdate(
    { GuildID: guildId, UserID: author.id },
    { afk: { isAFK: false } }
  );
  client.cache.delete(`afk-${guildId}-${author.id}`);
  await message.channel
    .send(`<@${author.id}> - Welcome back! I have removed your AFK status.`)
    .then((m) => {
      setTimeout(() => m.delete(), 5 * 1000);
      return;
    });

  setTimeout(
    () => client.cache.delete(`afk-${guildId}-${author.id}`),
    10 * 1000
  );
};
