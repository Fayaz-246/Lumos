const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
  ApplicationCommandOptionWithChoicesAndAutocompleteMixin,
} = require("discord.js");
const userSchema = require("../../schemas/economy.js");

module.exports = {
  memberPerms: PermissionsBitField.Flags.Administrator,
  data: new SlashCommandBuilder()
    .setName("money")
    .setDescription("Manage a user's wallet.")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add money to a user")
        .addIntegerOption((opt) =>
          opt
            .setName("amount")
            .setDescription("Amount to add")
            .setRequired(true)
        )
        .addUserOption((opt) =>
          opt.setName("user").setDescription("The user to add")
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove money from a user")
        .addIntegerOption((opt) =>
          opt
            .setName("amount")
            .setDescription("Amount to remove")
            .setRequired(true)
        )
        .addUserOption((opt) =>
          opt.setName("user").setDescription("The user to remove")
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") ?? interaction.user;

    if (await client.cache.get(`eco-${user.id}-${interaction.guildId}`))
      await client.cache.delete(`eco-${user.id}-${interaction.guildId}`);

    const amt = interaction.options.getInteger("amount");
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({
        name: `${user.globalName || user.username}`,
        iconURL: `${user.displayAvatarURL()}`,
      })
      .setTimestamp();

    await interaction.deferReply();
    const data = await userSchema.findOne({
      GuildID: interaction.guildId,
      UserID: user.id,
    });

    switch (interaction.options.getSubcommand()) {
      case "add":
        if (!data)
          await userSchema.create({
            GuildID: interaction.guildId,
            UserID: user.id,
            wallet: amt,
            bank: 0,
          });
        else {
          data.wallet += amt;
          await data.save();
        }
        embed.setDescription(`Added **${amt}** 💶 to ${user.username}`);
        break;

      case "remove":
        if (!data)
          return embed.setDescription(`${user.username} has no money!`);
        data.wallet -= amt;
        await data.save();
        embed.setDescription(`Removed **${amt}** 💶 from ${user.username}`);
        break;
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
