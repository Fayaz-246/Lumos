const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    await interaction.reply({
      embeds: [
        {
          description: `It's **${result}**!`,
          color: parseInt(client.config.embedColor.slice(1), 16),
        },
      ],
    });
  },
};
