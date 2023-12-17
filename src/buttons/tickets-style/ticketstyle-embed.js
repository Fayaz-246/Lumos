const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: { customId: "ticket.style.embed" },
  execute: async (i) => {
    await i.update({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket-title")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Title"),
          new ButtonBuilder()
            .setCustomId("ticket-desc")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Description"),
          new ButtonBuilder()
            .setCustomId("ticket-color")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Color")
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("back-ticket")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Back")
        ),
      ],
    });
  },
};
