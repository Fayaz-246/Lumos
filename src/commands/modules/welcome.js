const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const welcomeSchema = require("../../schemas/welcome");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("Fully customisable welcome system!")
    .addSubcommand((sub) =>
      sub
        .setName("setup")
        .setDescription("Setup the welcome system")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("The channel for the welcome messages to be sent")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("message")
            .setDescription(
              "The welcome message to send in the channel, you can use {tag}, {user}, {mention} and {membercount}"
            )
            .setRequired(true)
        )
    )
    .addSubcommandGroup((subGroup) =>
      subGroup
        .setName("edit")
        .setDescription("Edit the welcome system")
        .addSubcommand((sub) =>
          sub
            .setName("channel")
            .setDescription("Change the welcome channel")
            .addChannelOption((opt) =>
              opt
                .setName("channel")
                .setDescription(
                  "The channel for the welcome messages to be sent"
                )
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("message")
            .setDescription("Change the message sent in the welcome channel")
            .addStringOption((opt) =>
              opt
                .setName("message")
                .setDescription(
                  "The welcome message to send in the channel, you can use {tag}, {user}, {mention} and {membercount}"
                )
                .setRequired(true)
            )
        )
    )
    .addSubcommand((sub) =>
      sub.setName("disable").setDescription("Disable the welcome system")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, member, guildId } = interaction;
    const subCommand = options.getSubcommand(true);
    const subCommandGroup = options.getSubcommandGroup();
    const { embedColor, successColor, emojis, errorColor } = client.config;

    const channel = options.getChannel("channel");
    const message = options.getString("message");

    const embed = new EmbedBuilder();
    const data = await welcomeSchema.findOne({ GuildID: guildId });

    async function checkData() {
      if (!data)
        await interaction.reply({
          content: "Welcome system is not setup in this server!",
          ephemeral: true,
        });
      return data;
    }

    if (data) await client.cache.delete(`welcome-${guildId}`);

    if (subCommandGroup) {
      if (!(await checkData())) return;

      switch (subCommand) {
        case "channel":
          await welcomeSchema.findOneAndUpdate(
            { GuildID: guildId },
            { ChannelID: channel.id }
          );
          embed
            .setColor(successColor)
            .setTitle("Updated Welcome Channel!")
            .addFields({
              name: "Channel: ",
              value: `> ${channel.name} \`\`\`[${channel.id}]\`\`\``,
            });
          await interaction.reply({ ephemeral: true, embeds: [embed] });
          break;

        case "message":
          await welcomeSchema.findOneAndUpdate(
            { GuildID: guildId },
            { Message: message }
          );
          embed
            .setColor(successColor)
            .setTitle("Updated Welcome Message!")
            .addFields({
              name: "Message: ",
              value: `> ${message}`,
            });
          await interaction.reply({ ephemeral: true, embeds: [embed] });
          break;
      }
    } else {
      switch (subCommand) {
        case "disable":
          if (!(await checkData())) return;

          await welcomeSchema.findOneAndDelete({ GuildID: guildId });
          embed
            .setColor(errorColor)
            .setDescription("**Disabled welcome system!**");
          await interaction.reply({ ephemeral: true, embeds: [embed] });
          break;

        case "setup":
          if (data)
            return await interaction.reply({
              content:
                "Welcome system is already setup in this server, you can use `/welcome edit`!",
              ephemeral: true,
            });

          await welcomeSchema.create({
            GuildID: guildId,
            ChannelID: channel.id,
            Message: message,
          });

          embed
            .setColor(successColor)
            .setTitle("Setup Welcome System!")
            .addFields(
              {
                name: "Channel: ",
                value: `> <#${channel.name}> \`[${channel.id}]\``,
              },
              { name: "Message: ", value: `> \`\`\`${message}\`\`\`` }
            );

          await interaction.reply({ ephemeral: true, embeds: [embed] });
          break;
      }
    }
  },
};
