const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: { customId: "ticket.style.button" },
  execute: async (i) => {
    await i.update({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket-btnEmoji")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Emoji"),
          new ButtonBuilder()
            .setCustomId("ticket-btnLabel")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Label")
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
