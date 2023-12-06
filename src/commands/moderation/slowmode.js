const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  memberPerms: PermissionFlagsBits.ManageChannels,
  botPerms: PermissionFlagsBits.ManageChannels,
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set the slowmode for the channel")
    .addNumberOption((option) =>
      option.setName("time").setDescription("The slowmode time in seconds.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const channel = interaction.channel;
    let time = interaction.options.getNumber("time") || 0;

    const { successColor, emojis } = client.config;

    const em = new EmbedBuilder()
      .setColor(successColor)
      .setDescription(
        `${emojis.success} **Set the slowmode for the current channel to \`${time}\` seconds.**`
      );

    await channel.setRateLimitPerUser(time).then(() => {
      interaction.reply({ embeds: [em] });
    });
  },
};
