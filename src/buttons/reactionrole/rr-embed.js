const {
  ButtonInteraction,
  Client,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const schema = require("../../schemas/reactionrole");

module.exports = {
  data: { customId: "rr.embed" },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @param {*} db
   */
  execute: async (interaction, client, args) => {
    const cache = client.cache.get(
      `rr-embed-${interaction.guildId}-${interaction.user.id}`
    );
    if (!cache)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTimestamp()
      .setFooter({
        iconURL: interaction.guild.iconURL(),
        text: `${interaction.guild.name} Reaction Role Config`,
      });
    switch (args[0]) {
      case "title":
        const titleModal = new ModalBuilder()
          .setCustomId("input-title")
          .setTitle("Enter The Title For The Embed")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("input")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(100)
                .setMinLength(1)
                .setRequired(true)
                .setLabel("Input")
            )
          );
        await interaction.showModal(titleModal);
        break;
      case "desc":
        const descModal = new ModalBuilder()
          .setCustomId("input-desc")
          .setTitle("Enter The Description For The Embed")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("input")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(2450)
                .setMinLength(1)
                .setRequired(true)
                .setLabel("Input")
            )
          );
        await interaction.showModal(descModal);
        break;
      case "color":
        const colorModal = new ModalBuilder()
          .setCustomId("input-color")
          .setTitle("Enter The Color For The Embed")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("input")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(7)
                .setMinLength(7)
                .setRequired(true)
                .setLabel("Input [HEX]")
            )
          );
        await interaction.showModal(colorModal);
        break;
      case "ts":
        cache.data.Embed.timestamp =
          cache.data.Embed.timestamp == false ? true : false;
        const embedConfigEmbed = new ActionRowBuilder().addComponents(
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
              cache.data.Embed.timestamp == false
                ? ButtonStyle.Danger
                : ButtonStyle.Success
            )
            .setEmoji(
              cache.data.Embed.timestamp == false
                ? "<:disable:1187712887356133477>"
                : "<:enable:1187712882104860684>"
            )
            .setLabel("Timestamp")
        );
        await interaction.update({
          embeds: [embed.setTitle("✏️ Edit The Panel Embed")],
          components: [
            embedConfigEmbed,
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("rr.embed-preview")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("<:preview:1187724802950180894>")
                .setLabel("Preview")
            ),
          ],
        });

        await cache.data.save();
        break;
      case "preview":
        await interaction.deferUpdate();
        const data = await schema.findOne({ GuildID: interaction.guildId });
        await interaction.editReply({
          embeds: [
            {
              title: data.Embed.title,
              description: data.Embed.description,
              color: data.Embed.color,
              timestamp: data.Embed.timestamp ? new Date().toISOString() : null,
            },
          ],
          components: [
            {
              type: 1,
              components: [
                {
                  custom_id: `back-rr.embed`,
                  type: 2,
                  label: "Back",
                  style: 4,
                },
              ],
            },
          ],
        });
        break;
    }
  },
};
