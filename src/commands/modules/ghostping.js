const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");
const schema = require("../../schemas/ghostping");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anti-ghostping")
    .setDescription("An Anti-Ghost ping system")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand((sub) =>
      sub.setName("enable").setDescription("Enable the system.")
    )
    .addSubcommand((sub) =>
      sub.setName("disable").setDescription("Disable the system.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { guildId, options } = interaction;
    const sub = options.getSubcommand(["enable", "disable"]);

    await interaction.deferReply({ ephemeral: true });
    const data = await schema.findOne({ GuildID: guildId });
    switch (sub) {
      case "enable":
        if (data)
          return await interaction.editReply(
            "The anti-ghost ping system is already setup in this server!"
          );
        await schema.create({ GuildID: guildId });
        await interaction.editReply({
          embeds: [
            {
              color: 5763719,
              description: "Enabled `Anti-Ghost Ping` in this server!",
            },
          ],
        });
        break;

      case "disable":
        if (!data)
          return await interaction.editReply(
            "The anti-ghost ping system is not setup in this server!"
          );
        await schema.findOneAndDelete({ GuildID: guildId });
        await interaction.editReply({
          embeds: [
            {
              color: 15548997,
              description: "Disabled `Anti-Ghost Ping` in this server!",
            },
          ],
        });
        break;
    }
  },
};
