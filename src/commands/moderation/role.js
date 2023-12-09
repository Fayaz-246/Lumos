const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  memberPerms: PermissionsBitField.Flags.ManageRoles,
  botPerms: PermissionsBitField.Flags.ManageRoles,
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage Roles!")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a role to a member")
        .addRoleOption((opt) =>
          opt
            .setRequired(true)
            .setName("role")
            .setDescription("The role to add.")
        )
        .addUserOption((opt) =>
          opt
            .setRequired(true)
            .setName("member")
            .setDescription("The member to add the role to.")
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a role from a member")
        .addRoleOption((opt) =>
          opt
            .setRequired(true)
            .setName("role")
            .setDescription("The role to remove.")
        )
        .addUserOption((opt) =>
          opt
            .setRequired(true)
            .setName("member")
            .setDescription("The member to remove the role from.")
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("all")
        .setDescription("Add a role to every member in this server.")
        .addRoleOption((opt) =>
          opt
            .setRequired(true)
            .setName("role")
            .setDescription("The role to add to everyone.")
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, member } = interaction;
    const roleMember = options.getMember("member");
    const role = options.getRole("role");
    const subCommand = options.getSubcommand();
    const bot = interaction.guild.members.me;

    await handleSubcommands();

    async function handleSubcommands() {
      switch (subCommand) {
        case "add":
          if (role.position >= bot.roles.highest)
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.errorColor)
                  .setDescription(
                    `**The role [<@&${role.id}>] is greater than my highest role!**`
                  ),
              ],
              ephemeral: true,
            });
          await roleMember.roles.add(role);
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.successColor)
                .setDescription(
                  `**Added \`${role.name}\` to \`${
                    roleMember.user.globalName ?? roleMember.user.username
                  }**`
                ),
            ],
          });
          break;

        case "remove":
          if (role.position >= bot.roles.highest)
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.errorColor)
                  .setDescription(
                    `**The role [<@&${role.id}>] is greater than my highest role!**`
                  ),
              ],
              ephemeral: true,
            });

          if (!roleMember.roles.cache.has(role))
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.errorColor)
                  .setDescription(
                    `**${
                      roleMember.user.globalName ?? roleMember.user.username
                    } does not have this role!**`
                  ),
              ],
              ephemeral: true,
            });
          await roleMember.roles.remove(role);
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.successColor)
                .setDescription(
                  `**Removed \`${role.name}\` from \`${
                    roleMember.user.globalName ?? roleMember.user.username
                  }**`
                ),
            ],
          });
          break;

        case "all":
          if (!member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.errorColor)
                  .setDescription(`**This is an admin only command.**`),
              ],
              ephemeral: true,
            });

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setDescription(
                  `<a:loading:1176158946805944341> Adding \`${role.name}\` to - members.`
                ),
            ],
          });
          const members = await interaction.guild.members.fetch();

          let i = 0;

          for (const member of members.values()) {
            if (member.roles.cache.has(role)) return;
            await member.roles.add(role);
            i++;
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.embedColor)
                  .setDescription(
                    `<a:loading:1176158946805944341> Adding \`${role.name}\` to ${i} members.`
                  ),
              ],
            });
          }

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setDescription(
                  `<a:tick:1183040892920156171> Added \`${role.name}\` to ${i} numbers!`
                ),
            ],
          });
          break;
      }
    }
  },
};
