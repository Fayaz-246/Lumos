const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const welcomeSchema = require("../../schemas/welcome");

/**
 *
 * @param {GuildMember} member
 * @param {Client} client
 */
module.exports = async (client, member) => {
  const { guild } = member;
  const { embedColor } = client.config;

  let res = await client.cache.get(`welcome-${guild.id}`);

  let data;

  if (res) {
    data = res;
  } else {
    data = await welcomeSchema.findOne({ GuildID: guild.id });
    if (!data) return;

    await client.cache.set(`welcome-${guild.id}`, data);
  }

  const embed = new EmbedBuilder().setColor(embedColor);

  const interpolate = (message) => {
    return message
      .replace(/{tag}/g, `${member.user.username}#${member.user.discriminator}`)
      .replace(/{mention}/g, `<@${member.user.id}>`)
      .replace(/{membercount}/g, `${member.guild.memberCount}`)
      .replace(/{user}/g, member.user.username);
  };

  embed
    .setDescription(`${interpolate(data.Message)}`)
    .setTimestamp()
    .setTitle("Welcome!");

  await guild.channels.cache
    .get(data.ChannelID)
    .send({ embeds: [embed] })
    .catch(() => {});

  setTimeout(() => {
    client.cache.delete(`welcome-${guild.id}`);
  }, 60 * 1000);
};
