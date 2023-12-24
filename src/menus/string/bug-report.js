const {
  StringSelectMenuInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const formatStr = require("../../utils/formatStr");

module.exports = {
  data: { customId: "bgr" },
  /**
   *
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let cache = client.cache.get(`bug-reports-${interaction.user.id}`);
    if (!cache)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });
    client.cache.set(`bug-reports-${interaction.user.id}`, {
      title: cache.title,
      priority: interaction.values[0],
      description: cache.description,
    });
    cache = client.cache.get(`bug-reports-${interaction.user.id}`);
    let disabled = true;
    if (
      cache.title != "NOT SET" &&
      cache.priority != "NOT SET" &&
      cache.description != "NOT SET"
    )
      disabled = false;

    const embed = {
      title: "Bug Report",
      description: `**Title:** \`${cache.title}\`\n**Priority:** \`${formatStr(
        cache.priority
      )}\`\n**Description:** \`\`\`${cache.description}\`\`\``,
      color: parseInt(client.config.embedColor, 16),
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
        .setDisabled(disabled)
    );
    await interaction.update({
      embeds: [embed],
      components: [row1, row2],
    });
  },
};
