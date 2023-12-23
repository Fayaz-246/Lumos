const {
  Interaction,
  Client,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  const { menus, config } = client;
  if (interaction.componentType == ComponentType.RoleSelect) {
    const iMenu = menus.role.get(interaction.customId);
    if (!iMenu) return;

    try {
      await iMenu.execute(interaction, client);
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
      client.logs.error(
        `${interaction.customId} Role Select Error - \n${err.stack}`
      );
    }
  } else if (interaction.componentType == ComponentType.StringSelect) {
    const iMenu = menus.string.get(interaction.customId);
    if (!iMenu) return;

    try {
      await iMenu.execute(interaction, client);
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
      client.logs.error(
        `${interaction.customId} String Select Error - \n${err.stack}`
      );
    }
  }
};
