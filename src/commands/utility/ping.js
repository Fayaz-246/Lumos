const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows API Latency / Bot ping"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    const emBed = new EmbedBuilder()
      .setTitle("Pong! 🏓")
      .setColor(client.config.embedColor)
      .addFields(
        {
          name: "API Latency: ",
          value: `\`\`\`${client.ws.ping}ms\`\`\``,
          inline: true,
        },
        {
          name: "Bot Latency: ",
          value: `\`\`\`${
            message.createdTimestamp - interaction.createdTimestamp
          }ms\`\`\``,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Returned Ping!", iconURL: client.user.avatarURL() });
    await interaction.editReply({
      embeds: [emBed],
    });
  },
};
