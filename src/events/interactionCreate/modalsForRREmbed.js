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
  if (!interaction.customId.startsWith("input")) return;
  const arg = interaction.customId.split("-")[1];
  const input = interaction.fields.getTextInputValue("input");
  const data = client.cache.get(
    `rr-embed-${interaction.guildId}-${interaction.user.id}`
  ).data;
  const action = arg == "desc" ? "description" : arg;

  if (action == "color") {
    data.Embed.color = parseInt(input.slice(1), 16);
  } else {
    data.Embed[action] = input;
  }

  await data.save();
  interaction.reply({
    content: `Set ${action} to \`${input}\``,
    ephemeral: true,
  });
};
