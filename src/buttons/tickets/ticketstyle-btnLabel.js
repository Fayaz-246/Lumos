const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
  data: { customId: `ticket.style.btnLabel` },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Object} info
   * @param {Client} client
   */
  execute: async (interaction, info, db, client) => {
    const repl = await interaction.reply({
      ephemeral: true,
      content: "Enter the text for the emoji.",
    });
    const collector = interaction.channel.createMessageCollector();
    collector.on("collect", async (msg) => {
      if (msg.author.id != interaction.user.id) return;
      if (msg.content.length > 100) {
        collector.stop();
        await interaction.followUp({
          content: "Text is too long. Click the button to use it again",
          ephemeral: true,
        });
        return await msg.delete().catch(() => {});
      }
      try {
        db.Button.label = msg.content;
        await msg.delete().catch(() => {});
        await db.save();
        await interaction.followUp({
          ephemeral: true,
          content: `Set label to:\`\`\`${msg.content}\`\`\``,
        });
      } catch (e) {
        client.logs.error(e);
      } finally {
        collector.stop();
      }
    });
  },
};
