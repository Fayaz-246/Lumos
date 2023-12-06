const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  botPerms: PermissionsBitField.Flags.EmbedLinks,
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("View the server's member count!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        {
          title: "Membercount",
          description: `**${interaction.guild.memberCount}**`,
          color: 0x0000,
        },
      ],
    });
  },
};
