const {
  ModalSubmitInteraction,
  Client,
  EmbedBuilder,
  InteractionType,
} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {ModalSubmitInteraction} interaction
 */
module.exports = async (client, interaction) => {
  if (interaction.type != InteractionType.ModalSubmit) return;
  if (interaction.customId != "radd-btnText") return;
  const cache = client.cache.get(`radd-${interaction.user.id}-modal`);
  const data = client.cache.get(
    `rr-${interaction.guildId}-${interaction.user.id}`
  ).data;

  await interaction.deferUpdate();
  await data.Roles.push({
    role: `${cache.role}`,
    Button: {
      type: 2,
      style: cache.color,
      label: `${interaction.fields.getTextInputValue("radd-field")}`,
      customId: `reaction.add-${cache.role}`,
    },
  });
  await data.save();
  await interaction.editReply({
    content: "Added a new button to the menu!",
    embeds: [],
    components: [],
  });
};
