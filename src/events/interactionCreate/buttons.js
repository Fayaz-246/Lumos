const { Client, Interaction, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;
  const { buttons, config } = client;
  const { customId } = interaction;
  const args = customId.split("-");
  const id = args.shift();
  const button = buttons.get(id);

  if (!button) return;
  try {
    await button.execute(interaction, client, args);
  } catch (err) {
    await interaction.deferReply().catch(() => {});
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.errorColor)
          .setTitle("An error occured!")
          .setDescription(
            `Please report this error: \`\`\`js\n${err.stack}\`\`\``
          ),
      ],
      ephemeral: true,
    });
    client.logs.error(`${customId} Button Error - \n${err.stack}`);
  }
};
