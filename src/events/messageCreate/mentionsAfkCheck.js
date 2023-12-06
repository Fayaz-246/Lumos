const { Client, Message } = require("discord.js");
const user = require("../../schemas/user");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;

  const { guildId } = message;
  const mentions = message.mentions.users.map((m) => m.id);
  if (mentions <= 0) return;
  mentions.forEach(async (member) => {
    const res = client.cache.get(`afk-${guildId}-${member}`);
    let data;
    if (res) {
      data = res;
    } else {
      data = await user.findOne({ GuildID: guildId, UserID: member });
      if (!data) return;
    }
    if (!data.afk.isAFK) return;
    const memberFetch = message.guild.members.cache.get(member);
    await message.reply(
      `${memberFetch.user.username} is AFK: \`${data.afk.reason}\` - ${data.afk.timestamp}`
    );
  });
};
