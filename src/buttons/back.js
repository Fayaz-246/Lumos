const {
  ButtonInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: { customId: "back" },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @param {String[]} args
   */
  execute: async (interaction, client, args) => {
    await interaction.deferUpdate();
    switch (args[0]) {
      case "ticket":
        await interaction.editReply({
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("ticket-embed")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Embed"),
              new ButtonBuilder()
                .setCustomId("ticket-button")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Button")
            ),
          ],
        });
    }
  },
};
