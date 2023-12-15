const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const ticketSchema = require("../../schemas/ticketSettings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("A fully customisable tikcet system!")
    .addSubcommand((sub) =>
      sub
        .setName("setup")
        .setDescription("Setup the ticket system!")
        .addChannelOption((opt) =>
          opt
            .setName("category")
            .setDescription("The category in whcih tickets will be created.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption((opt) =>
          opt
            .setName("logs")
            .setDescription(
              "The channel in which the tickets will be loggged with transcript."
            )
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption((opt) =>
          opt
            .setName("manager")
            .setDescription("The role which can see the ticket channels")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("send")
        .setDescription("Send the ticket message!")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("The channel to send the embed.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("disable").setDescription("Disable the ticket system.")
    )
    .addSubcommand((sub) =>
      sub
        .setName("style")
        .setDescription("Config the embeds and buttons of the system!")
    )
    .addSubcommandGroup((sg) =>
      sg
        .setName("config")
        .setDescription("Config the ticket system.")
        .addSubcommand((sub) =>
          sub
            .setName("category")
            .setDescription("The ticket category")
            .addChannelOption((opt) =>
              opt
                .setName("category")
                .setDescription(
                  "The category in whcih tickets will be created."
                )
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("channel")
            .setDescription("The logs channel")
            .addChannelOption((opt) =>
              opt
                .setName("channel")
                .setDescription(
                  "The category in whcih tickets will be created."
                )
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("role")
            .setDescription("The ticket manager role")
            .addRoleOption((opt) =>
              opt
                .setName("manager")
                .setDescription("The role which can see the ticket channels")
                .setRequired(true)
            )
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const { emojis, embedColor, errorColor, successColor } = client.config;
    const { guildId, options, member, guild } = interaction;
    const subCommand = options.getSubcommand();
    const subCommandGroup = options.getSubcommandGroup();
    const category = options.getChannel("category");
    const logs = options.getChannel("logs");
    const manager = options.getRole("manager");
    const channel = options.getChannel("channel");

    await interaction.deferReply({ ephemeral: true });
    const data = await ticketSchema.findOne({ GuildID: guildId });

    if (subCommandGroup) {
      if (!data)
        return await interaction.editReply(
          "The ticket system is not setup in this server!"
        );

      switch (subCommand) {
        case "category":
          await ticketSchema.findOneAndUpdate(
            { GuildID: guildId },
            { CategoryID: category.id }
          );
          await interaction.editReply(
            `Successfully updated tickets category to - <#${category.id}>`
          );
          break;

        case "logs":
          await ticketSchema.findOneAndUpdate(
            { GuildID: guildId },
            { TranscriptsID: logs.id }
          );
          await interaction.editReply(
            `Successfully updated ticket logs channel to - <#${logs.id}>`
          );
          break;

        case "role":
          await ticketSchema.findOneAndUpdate(
            { GuildID: guildId },
            { ManagerRole: manager.id }
          );
          await interaction.editReply(
            `Successfully updated ticket managers to <@&${manager.id}>`
          );
          break;
        default:
          break;
      }
    } else {
      switch (subCommand) {
        case "disable":
          if (!data)
            return await interaction.editReply(
              "The ticket system is not setup in this server!"
            );

          await ticketSchema.findOneAndDelete({ GuildID: guildId });
          await interaction.editReply(
            "Successfully disabled ticket system in this server!"
          );
          break;

        case "send":
          if (!data)
            return await interaction.editReply(
              "The ticket system is not setup in this server!"
            );

          const btn = data.Button;
          console.log(data.Button);
          const row = {
            type: 1,
            components: [
              {
                type: data.Button.type,
                customId: "tickets",
                style: data.Button.style,
                emoji: {
                  animated: data.Button.emoji.animated,
                  id: data.Button.emoji.id,
                  name: data.Button.emoji.name,
                },
                label: data.Button.label,
              },
            ],
          };
          const tEmbed = data.Embed;

          await channel.send({ embeds: [tEmbed], components: [row] });
          await interaction.editReply("Sent message!");
          break;

        case "setup":
          if (data)
            return await interaction.editReply(
              "The ticket system is already setup in this server! You can use `/ticket config` to edit it!"
            );

          await ticketSchema.create({
            GuildID: guildId,
            CategoryID: category.id,
            TranscriptsID: logs.id,
            ManagerRole: manager.id,
          });
          embed
            .setColor(successColor)
            .setDescription(`${emojis.success} Setup ticket system!`)
            .addFields(
              {
                name: "Category: ",
                value: `> \`${category.name}\``,
                inline: true,
              },
              {
                name: "Logs Channel: ",
                value: `> \`${logs.name}\``,
                inline: true,
              },
              { name: "Ticket Manager: ", value: `> \`${manager.name}\`` }
            );

          await interaction.editReply({ embeds: [embed] });
          break;

        case "style":
          if (!data)
            return await interaction.editReply(
              "The ticket system is not setup in this server!"
            );

          embed
            .setColor(successColor)
            .setTitle("Ticket Config")
            .setDescription(
              "**Edit the ticket system with the buttons below!**"
            );
          const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("ticket-embed")
              .setStyle(ButtonStyle.Primary)
              .setLabel("Embed"),
            new ButtonBuilder()
              .setCustomId("ticket-button")
              .setStyle(ButtonStyle.Primary)
              .setLabel("Button")
          );

          await interaction.followUp({
            embeds: [embed],
            components: [actionRow],
          });

          client.caches.buttons.set(`tstyle-${interaction.user.id}`, {
            guild: interaction.guild,
            member: interaction.member,
          });

          break;
      }
    }
  },
};
