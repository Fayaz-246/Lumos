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
    .setName("bug-report")
    .setDescription("Report a bug to the devs."),
  cooldown: 3600,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const embed = {
      title: "Bug Report",
      description:
        "**Title:** `NOT SET`\n**Priority:** `NOT SET`\n**Description:** `NOT SET`",
      color: parseInt(client.config.embedColor.slice(1), 16),
    };
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`bug.reports-title`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Title"),
      new ButtonBuilder()
        .setCustomId(`bug.reports-pri`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Priority"),
      new ButtonBuilder()
        .setCustomId(`bug.reports-desc`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Description")
    );
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`back-bgr`)
        .setStyle(ButtonStyle.Danger)
        .setLabel("Cancel"),
      new ButtonBuilder()
        .setCustomId(`bug.reports-finish`)
        .setStyle(ButtonStyle.Success)
        .setLabel("Finish")
        .setDisabled(true)
    );
    await interaction
      .reply({
        ephemeral: true,
        embeds: [embed],
        components: [row1, row2],
      })
      .then(() =>
        client.cache.set(`bug-reports-${interaction.user.id}`, {
          title: "NOT SET",
          priority: "NOT SET",
          description: "NOT SET",
        })
      );
  },
};
