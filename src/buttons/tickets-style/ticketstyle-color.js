const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
  data: { customId: `ticket.style.color` },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Object} info
   * @param {Client} client
   */
  execute: async (interaction, info, db, client) => {
    const repl = await interaction.reply({
      ephemeral: true,
      content: "Enter the color for the embed. [ IN HEX ]",
    });
    console.log(db.Embed);
    const collector = interaction.channel.createMessageCollector();
    collector.on("collect", async (msg) => {
      if (msg.author.id != interaction.user.id) return;
      if (!isHex(msg.content)) {
        interaction.followUp({
          content: "Invalid HEX code. Click the button to use it again",
          ephemeral: true,
        });
        collector.stop();
        await msg.delete().catch(() => {});
        return;
      }
      try {
        db.Embed.color = parseInt(msg.content.slice(1), 16);
        await msg.delete().catch(() => {});
        await db.save();
        await interaction.followUp({
          ephemeral: true,
          content: `Set color to:\`\`\`${msg.content}\`\`\``,
        });
      } catch (e) {
        client.logs.error(e);
      } finally {
        collector.stop();
      }
    });
  },
};

function isHex(code) {
  const regex = /^#[0-9a-fA-F]{6}$/;
  return regex.test(code);
}
