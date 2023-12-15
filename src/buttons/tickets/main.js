const { ButtonInteraction, Client } = require("discord.js");
const ticketSettings = require("../../schemas/ticketSettings");

module.exports = {
  data: { customId: "ticket" },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @param {String[]} args
   */
  execute: async (interaction, client, args) => {
    const info = client.caches.buttons.get(`tstyle-${interaction.user.id}`);
    if (!info)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ You cannot use this button...",
      });
    const button = client.buttons.get(`ticket.style.${args[0]}`);
    const db = await ticketSettings.findOne({ GuildID: info.guild.id });
    button.execute(interaction, info, db, client);
  },
};
