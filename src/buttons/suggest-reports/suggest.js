const {
  StringSelectMenuBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonInteraction,
  Client,
} = require("discord.js");
const formatStr = require("../../utils/formatStr");

module.exports = {
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * */
  data: { customId: "suggest" },
  async execute(interaction, client, args) {
    const cache = client.cache.get(`suggestions-${interaction.user.id}`);
    if (!cache)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });
    switch (args[0]) {
      case "title":
        const titleInputModal = new ModalBuilder()
          .setCustomId("suggest-title")
          .setTitle("Enter Title For The Suggestion")
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
        await interaction.showModal(titleInputModal);
        break;
      case "desc":
        const descInputModal = new ModalBuilder()
          .setCustomId("suggest-desc")
          .setTitle("Enter Title For The Suggestion")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("input")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(2000)
                .setMinLength(1)
                .setRequired(true)
                .setLabel("Input")
            )
          );
        await interaction.showModal(descInputModal);
        break;
      case "type":
        const select = new StringSelectMenuBuilder()
          .setCustomId("suggest")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions(
            {
              label: "Command",
              value: "command",
            },
            {
              label: "Feature",
              value: "feature",
            },
            {
              label: "Other",
              value: "other",
            }
          );
        await interaction.update({
          components: [new ActionRowBuilder().addComponents(select)],
        });
        break;

      case "submit":
        const data = client.cache.get(`suggestions-${interaction.user.id}`);
        const color = { command: 0x5865f2, feature: 0xf1c40f, other: 0xffffff }[
          data.type.toLowerCase()
        ];
        const embed = {
          color: color,
          title: "Suggestion ℹ️",
          timestamp: new Date().toISOString(),
          author: {
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.username,
          },
          description: `**Title**: \`${data.title}\`\n**Description:**\n\`\`\`\n${data.description}\`\`\``,
          fields: [
            {
              name: "Type",
              value: `\`${formatStr(data.type)}\``,
            },
          ],
        };
        await client.channels.cache
          .get(process.env.SuggestionsChannelID)
          .send({ embeds: [embed] });
        await interaction.update({
          embeds: [],
          components: [],
          content: "Sent your report!",
        });
        break;
    }
  },
};
