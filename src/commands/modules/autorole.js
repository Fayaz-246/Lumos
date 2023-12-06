const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");
const autoRoleSchema = require("../../schemas/autorole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("An auto role system!")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add an auto-role trigger")
        .addRoleOption((opt) =>
          opt
            .setName("role")
            .setDescription("The role to add when a member joins.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove an auto-role trigger")
        .addRoleOption((opt) =>
          opt
            .setName("role")
            .setDescription("The role to remove from the list of triggers.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("disable").setDescription("Disable the whole system")
    )
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all the roles in the system.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const data = await autoRoleSchema.findOne({ GuildID: guildId });
    const role = options.getRole("role");
    const sub = options.getSubcommand();

    const { embedColor, successColor, errorColor } = client.config;
    const embed = new EmbedBuilder();

    const bot = interaction.guild.members.me;

    if (role && role.position > bot.roles.highest.position)
      return await interaction.reply({
        ephemeral: true,
        content: "I cannot manager that role as it is higher than mine!",
      });

    await interaction.deferReply({ ephemeral: true });

    async function dataCheck() {
      if (!data)
        await interaction.editReply({
          content: "The `auto-role` system is not setup in this server!",
        });
      return data;
    }

    if (data) await client.cache.delete(`autorole-${guildId}`);

    switch (sub) {
      case "add":
        if (!data) {
          await autoRoleSchema.create({ GuildID: guildId, Roles: [role.id] });
          embed
            .setColor(successColor)
            .setTitle("Added a new role!")
            .addFields({ name: "Role", value: `> <@&${role.id}>` });
        } else {
          data.Roles.push(role.id);
          await data.save();

          embed
            .setColor(successColor)
            .setTitle("Added a new role!")
            .addFields({ name: "Role", value: `> <@&${role.id}>` });
        }
        await interaction.editReply({ embeds: [embed] });
        break;

      case "remove":
        if (!(await dataCheck())) return;

        let find = data.Roles.find((rID) => rID == role.id);

        if (!find)
          return await interaction.editReply({
            content: `<@&${role.id}> is not added in the auto-role system!`,
          });

        let filter = data.Roles.filter((id) => id !== find);

        data.Roles = filter;
        await data.save();
        embed
          .setColor(errorColor)
          .setTitle("Removed a role!")
          .addFields({ name: "Role", value: `> <@&${role.id}>` });
        await interaction.editReply({ embeds: [embed] });
        break;

      case "disable":
        if (!(await dataCheck())) return;

        await autoRoleSchema.findOneAndDelete({ GuildID: guildId });
        embed
          .setColor(successColor)
          .setDescription("Disabled auto role system!");
        await interaction.editReply({ embeds: [embed] });
        break;

      case "list":
        if (!(await dataCheck())) return;
        embed
          .setColor(embedColor)
          .setDescription(
            `**All roles:**\n> ${data.Roles.map((r) => `<@&${r}>`).join(" ")}`
          );
        await interaction.editReply({ embeds: [embed] });
        break;
    }
  },
};
