const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
  data: { customId: `ticket.style.btnEmoji` },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Object} info
   * @param {Client} client
   */
  execute: async (interaction, info, db, client) => {
    const repl = await interaction.reply({
      ephemeral: true,
      content: "Enter the emoji for the button.",
    });
    const collector = interaction.channel.createMessageCollector();
    collector.on("collect", async (msg) => {
      if (msg.author.id != interaction.user.id) return;
      if (!toEmoji(msg.content)) {
        collector.stop();
        await interaction.followUp({
          content: "Invalid emoji. Click the button to use it again",
          ephemeral: true,
        });
        return await msg.delete().catch(() => {});
      }

      try {
        db.Button.emoji = toEmoji(msg.content);
        await msg.delete().catch(() => {});
        await db.save();
        await interaction.followUp({
          ephemeral: true,
          content: `Set emoji to:\`\`\`${msg.content}\`\`\``,
        });
      } catch (e) {
        client.logs.error(e);
      } finally {
        collector.stop();
      }
    });
  },
};

function toEmoji(input) {
  const regex = /<(a)?:([\w_]+):(\d+)>/;
  const match = input.match(regex);

  if (!match) return null;

  const id = match.pop();
  const name = match.pop();
  const animated = match.pop() === "a";

  return { animated, name, id };
}
