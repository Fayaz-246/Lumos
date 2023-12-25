const {
  StringSelectMenuInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const formatStr = require("../../utils/formatStr");

module.exports = {
  data: { customId: "suggest" },
  /**
   *
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let cache = client.cache.get(`suggestions-${interaction.user.id}`);
    if (!cache)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });
    client.cache.set(`suggestions-${interaction.user.id}`, {
      title: cache.title,
      type: interaction.values[0],
      description: cache.description,
    });
    cache = client.cache.get(`suggestions-${interaction.user.id}`);
    let disabled = true;
    if (
      cache.title != "NOT SET" &&
      cache.type != "NOT SET" &&
      cache.description != "NOT SET"
    )
      disabled = false;

    const embed = {
      title: "Bug Report",
      description: `**Title:** \`${cache.title}\`\n**Type:** \`${formatStr(
        cache.type
      )}\`\n**Description:** \`\`\`${cache.description}\`\`\``,
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
        .setLabel("Finish")
        .setDisabled(disabled)
    );
    await interaction.update({
      embeds: [embed],
      components: [row1, row2],
    });
  },
};
