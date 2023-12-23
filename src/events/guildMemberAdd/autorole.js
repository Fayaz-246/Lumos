const { Client, GuildMember } = require("discord.js");
const roleSchema = require("../../schemas/autorole");

/**
 *
 * @param {GuildMember} member
 * @param {Client} client
 */
module.exports = async (client, member) => {
  const { guild } = member;
  const { embedColor } = client.config;

  const res = await client.cache.get(`autorole-${guild.id}`);

  let data;

  if (res) {
    data = res;
  } else {
    data = await roleSchema.findOne({ GuildID: guild.id });
    if (!data) return;

    await client.cache.set(`autorole-${guild.id}`, data);
  }

  if (data.Roles.length < 0) return;
  for (const r of data.Roles) {
    await member.roles.add(r).catch(() => {});
  }

  setTimeout(() => {
    client.cache.delete(`autorole-${guild.id}`);
  }, 60 * 1000);
};
