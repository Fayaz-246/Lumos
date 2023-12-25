const {
  ModalSubmitInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionType,
} = require("discord.js");
const formatStr = require("../../utils/formatStr");

/**
 *
 * @param {Client} client
 * @param {ModalSubmitInteraction} interaction
 */
module.exports = async (client, interaction) => {
  if (interaction.type != InteractionType.ModalSubmit) return;
  if (!interaction.customId.startsWith("suggest")) return;
  const arg = interaction.customId.split("-")[1];
  const input = interaction.fields.getTextInputValue("input");
  let cache = client.cache.get(`suggestions-${interaction.user.id}`);
  if (!cache)
    return await interaction.reply({
      ephemeral: true,
      content: "🛠️ Something went wrong...",
    });

  client.cache.set(`suggestions-${interaction.user.id}`, {
    title: arg == "title" ? input : cache.title,
    type: cache.type,
    description: arg == "desc" ? input : cache.description,
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
    title: "Suggestion",
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
};
