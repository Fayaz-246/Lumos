const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-suggst")
    .setDescription("Suggest a feature for the bot!"),
  //cooldown: 3600,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const embed = {
      title: "Suggestion",
      description:
        "**Title:** `NOT SET`\n**Type:** `NOT SET`\n**Description:** `NOT SET`",
      color: parseInt(client.config.embedColor.slice(1), 16),
    };
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`suggest-title`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Title"),
      new ButtonBuilder()
        .setCustomId(`suggest-type`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Type"),
      new ButtonBuilder()
        .setCustomId(`suggest-desc`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Description")
    );
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`back-suggest`)
        .setStyle(ButtonStyle.Danger)
        .setLabel("Cancel"),
      new ButtonBuilder()
        .setCustomId(`suggest-submit`)
        .setStyle(ButtonStyle.Success)
        .setLabel("Submit")
        .setDisabled(true)
    );
    await interaction
      .reply({
        ephemeral: true,
        embeds: [embed],
        components: [row1, row2],
      })
      .then(() =>
        client.cache.set(`suggestions-${interaction.user.id}`, {
          title: "NOT SET",
          type: "NOT SET",
          description: "NOT SET",
        })
      );
  },
};
