const {
  ButtonInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const reactionrole = require("../schemas/reactionrole.js");

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
        break;
      case "rr.embed":
        const data = await reactionrole.findOne({
          GuildID: interaction.guildId,
        });
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embedColor)
              .setTimestamp()
              .setFooter({
                iconURL: interaction.guild.iconURL(),
                text: `${interaction.guild.name} Reaction Role Config`,
              })
              .setTitle("✏️ Add / Remove Roles"),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("rr.embed-title")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:pencil:1187723092420730941>")
                .setLabel("Title"),
              new ButtonBuilder()
                .setCustomId("rr.embed-desc")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:pencil:1187723092420730941>")
                .setLabel("Description"),
              new ButtonBuilder()
                .setCustomId("rr.embed-color")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:pencil:1187723092420730941>")
                .setLabel("Color"),
              new ButtonBuilder()
                .setCustomId("rr.embed-ts")
                .setStyle(
                  data.Embed.timestamp == false
                    ? ButtonStyle.Danger
                    : ButtonStyle.Success
                )
                .setEmoji(
                  data.Embed.timestamp == false
                    ? "<:disable:1187712887356133477>"
                    : "<:enable:1187712882104860684>"
                )
                .setLabel("Timestamp")
            ),
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("rr.embed-preview")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("<:preview:1187724802950180894>")
                .setLabel("Preview")
            ),
          ],
        });
        break;
      case "bgr":
        await interaction.deleteReply();
        client.cache.remove(`bug-reports-${interaction.user.id}`);
        break;
      case "suggest":
        await interaction.deleteReply();
        client.cache.remove(`suggestions-${interaction.user.id}`);
        break;
    }
  },
};
