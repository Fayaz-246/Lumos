const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get some info on the server."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { guild } = interaction;
    const embed = new EmbedBuilder().setColor(client.config.embedColor);

    const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;
    const roleNumber = guild.roles.cache.size;
    const emojiNumber = guild.emojis.cache.size;
    const channelNumber = guild.channels.cache.filter(
      (c) => c.type != ChannelType.GuildCategory
    ).size;
    const ownerUser = (await guild.fetchOwner()).user.username;

    embed
      .setThumbnail(guild.iconURL())
      .setTitle(`Server Info On ${guild.name}`)
      .setTimestamp()
      .addFields(
        { name: `Name: `, value: `\`\`\`${guild.name}\`\`\``, inline: true },
        { name: `ID: `, value: `\`\`\`${guild.id}\`\`\``, inline: true },
        { name: `Owner: `, value: `\`\`\`${ownerUser}\`\`\``, inline: true },
        {
          name: `Emojis: `,
          value: `\`\`\`${emojiNumber}\`\`\``,
          inline: true,
        },
        { name: `Roles: `, value: `\`\`\`${roleNumber}\`\`\``, inline: true },
        {
          name: `Channels: `,
          value: `\`\`\`${channelNumber}\`\`\``,
          inline: true,
        },
        { name: `Created: `, value: `${createdAt}` }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
