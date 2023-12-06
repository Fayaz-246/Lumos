const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const formatStr = require("../../utils/formatStr");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modules")
    .setDescription("Check which modules are enabled in this server."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    async function getData(schema) {
      return await schema.findOne({ GuildID: interaction.guildId });
    }

    await interaction.deferReply({ ephemeral: true });

    const modules = client.modules.sort(
      (a, b) => b.name.length - a.name.length
    );

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle(`${interaction.guild.name}'s Modules`)
      .setTimestamp();

    let description = "";

    for (const modulex of modules) {
      const data = await getData(modulex.file);
      const fName =
        modulex.name === "ticketSettings" ? "Tickets" : modulex.name;

      description += `**${formatStr(fName)}:** ${
        data ? client.config.emojis.success : client.config.emojis.error
      }\n`;
    }

    embed.setDescription(description);

    await interaction.editReply({ embeds: [embed] });
  },
};
