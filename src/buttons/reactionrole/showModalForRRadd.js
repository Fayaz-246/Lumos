const {
  ButtonInteraction,
  Client,
  ButtonStyle,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: { customId: "rr.radd" },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @param {*} db
   */
  execute: async (interaction, client, args) => {
    const cacheData = client.cache.get(`radd-${interaction.user.id}`);

    const input = new TextInputBuilder()
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setMaxLength(100)
      .setPlaceholder("Enter the text for the button")
      .setLabel("Text")
      .setCustomId("radd-field");

    const row = new ActionRowBuilder().addComponents(input);

    const modal = new ModalBuilder()
      .setTitle("Button Text")
      .setCustomId("radd-btnText")
      .addComponents(row);

    if (!cacheData)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });
    switch (args[0]) {
      case "blue":
        client.cache.set(`radd-${interaction.user.id}-modal`, {
          role: cacheData.role,
          color: ButtonStyle.Primary,
        });
        break;
      case "green":
        client.cache.set(`radd-${interaction.user.id}-modal`, {
          role: cacheData.role,
          color: ButtonStyle.Success,
        });
        break;
      case "red":
        client.cache.set(`radd-${interaction.user.id}-modal`, {
          role: cacheData.role,
          color: ButtonStyle.Danger,
        });
        break;
      case "grey":
        client.cache.set(`radd-${interaction.user.id}-modal`, {
          role: cacheData.role,
          color: ButtonStyle.Secondary,
        });
        break;
    }
    await interaction.showModal(modal);
  },
};
