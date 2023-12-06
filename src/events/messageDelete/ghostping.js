const { Client, Message, EmbedBuilder } = require("discord.js");
const ghostping = require("../../schemas/ghostping");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;
  const res = await client.cache.get(`antighostping-${message.guildId}`);

  let data;
  if (res) {
    data = res;
  } else {
    data = await ghostping.findOne({ GuildID: message.guildId });
    if (!data) return;
    await client.cache.set(`antighostping-${message.guildId}`, data);
  }

  if (!message.mentions) return;
  const mentions = message.mentions.users.first();
  const embed = new EmbedBuilder()
    .setColor(client.config.embedColor)
    .setAuthor({
      iconURL: message.author.displayAvatarURL(),
      name: `${message.author.username} Ghost Pinged >:(`,
    })
    .setDescription(
      `**A ghost ping occured! <@${message.author.id}> pinged ${mentions.username}.\n\nMessage: ${message.content}**`
    );

  await message.channel.send({ embeds: [embed] });

  setTimeout(() => {
    client.cache.delete(`antighostping-${message.guildId}`);
  }, 60 * 1000);
};
