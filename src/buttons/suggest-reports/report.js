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
  data: { customId: "bug.reports" },
  async execute(interaction, client, args) {
    const cache = client.cache.get(`bug-reports-${interaction.user.id}`);
    if (!cache)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });
    switch (args[0]) {
      case "title":
        const titleInputModal = new ModalBuilder()
          .setCustomId("bgr-title")
          .setTitle("Enter Title For The Report")
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
          .setCustomId("bgr-desc")
          .setTitle("Enter Title For The Report")
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
      case "pri":
        const select = new StringSelectMenuBuilder()
          .setCustomId("bgr")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions(
            {
              label: "High",
              value: "high",
              emoji: "<a:alert:1188379488120209428>",
            },
            {
              label: "Medium",
              value: "medium",
              emoji: `<a:warn:1188379554063065111>`,
            },
            {
              label: "Low",
              value: "low",
              emoji: "<:bug:1188379605237760123>",
            }
          );
        await interaction.update({
          components: [new ActionRowBuilder().addComponents(select)],
        });
        break;

      case "finish":
        const data = client.cache.get(`bug-reports-${interaction.user.id}`);
        const color = { high: 0xed4245, medium: 0xfee75c, low: 0x57f287 }[
          data.priority.toLowerCase()
        ];
        const embed = {
          color: color,
          title: "Bug Report ⚡",
          timestamp: new Date().toISOString(),
          author: {
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.username,
          },
          description: `**Title**: \`${data.title}\`\n**Description:**\n\`\`\`\n${data.description}\`\`\``,
          fields: [
            {
              name: "Priority",
              value: `\`${formatStr(data.priority)}\``,
            },
          ],
        };
        await client.channels.cache
          .get(process.env.BugReportChannelID)
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
