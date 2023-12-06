const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  memberPerms: PermissionsBitField.Flags.ManageChannels,
  botPerms: PermissionsBitField.Flags.ManageChannels,
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Lock or Unlock a channel")
    .addSubcommand((sub) =>
      sub.setName("lock").setDescription("Lock the current channel")
    )
    .addSubcommand((sub) =>
      sub.setName("unlock").setDescription("Unlock the current channel")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, channel, guild } = interaction;
    const { embedColor, successColor, errorColor, emojis } = client.config;
    const subCommand = options.getSubcommand();
    const embed = new EmbedBuilder();

    switch (subCommand) {
      case "lock":
        embed
          .setColor(successColor)
          .setDescription(
            `${emojis.success} **Successfully locked <#${channel.id}>!**`
          );

        await channel.permissionOverwrites.set([
          { id: guild.id, deny: [PermissionsBitField.Flags.SendMessages] },
        ]);
        await interaction.reply({ embeds: [embed] });
        break;

      case "unlock":
        embed
          .setColor(successColor)
          .setDescription(
            `${emojis.success} **Successfully unlocked <#${channel.id}>!**`
          );

        await channel.permissionOverwrites.set([
          { id: guild.id, allow: [PermissionsBitField.Flags.SendMessages] },
        ]);
        await interaction.reply({ embeds: [embed] });
        break;

      default:
        break;
    }
  },
};
