const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const birthdays = require("../../schemas/birthday");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("ENable or disable birthday notifications for this server")
    .addSubcommand((cmd) =>
      cmd
        .setName("enable")
        .setDescription("Enable the system in this server")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("The channel where the messages will be sent!")
            .addChannelTypes(
              ChannelType.GuildAnnouncement,
              ChannelType.GuildText
            )
            .setRequired(true)
        )
        .addStringOption((o) =>
          o.setName("message").setDescription("Templates: {mention}")
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("disable").setDescription("Disable the system in this server")
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { options, member, guildId } = interaction;
    const sub = options.getSubcommand();

    const str = options.getString("message") ?? "🎂 Happy birthday {mention}!";
    const channel = options.getChannel("channel");
    const data = await birthdays.findOne({ GuildID: guildId });

    if (sub == "disable") {
      if (!data)
        return await interaction.editReply(
          "The `birthday` system is not setup in this server."
        );
      await birthdays.findOneAndDelete({ GuildID: guildId });
      await interaction.editReply("Disabled the birthday system!");
    } else if (sub == "enable") {
      if (data)
        return await interaction.editReply(
          "The `birthday` system is already setup in this server."
        );
      await birthdays.create({
        GuildID: guildId,
        ChannelID: channel.id,
        Message: str,
      });
      await interaction.editReply("Enabled the birthday system!.");
    }
  },
};
