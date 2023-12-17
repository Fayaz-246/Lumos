const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
  data: { customId: `ticket.style.desc` },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Object} info
   * @param {Client} client
   */
  execute: async (interaction, info, db, client) => {
    const repl = await interaction.reply({
      ephemeral: true,
      content: "Enter the description for the embed.",
    });
    const collector = await interaction.channel.createMessageCollector();
    collector.on("collect", async (msg) => {
      if (msg.author.id != interaction.user.id) return;
      try {
        db.Embed.description = msg.content;
        await msg.delete().catch(() => {});
        await db.save();
        await interaction.followUp({
          ephemeral: true,
          content: `Set description to:\`\`\`${msg.content}\`\`\``,
        });
      } catch (e) {
        client.logs.error(e);
      } finally {
        collector.stop();
      }
    });
  },
};
