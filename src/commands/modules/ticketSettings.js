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
          const row = {
            type: 1,
            components: [btn],
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
              .setCustomId("ticket-title")
              .setStyle(ButtonStyle.Secondary)
              .setLabel("Title"),
            new ButtonBuilder()
              .setCustomId("ticket-desc")
              .setStyle(ButtonStyle.Secondary)
              .setLabel("Description"),
            new ButtonBuilder()
              .setCustomId("ticket-color")
              .setStyle(ButtonStyle.Secondary)
              .setLabel("Color"),
            new ButtonBuilder()
              .setCustomId("ticket-button")
              .setStyle(ButtonStyle.Secondary)
              .setLabel("Button"),
            new ButtonBuilder()
              .setCustomId("ticket-save")
              .setStyle(ButtonStyle.Success)
              .setLabel("Save")
          );

          const ticketButton = new ButtonBuilder()
            .setCustomId("tickets")
            .setLabel("Open")
            .setStyle(ButtonStyle.Primary);
          const ticketEmbed = new EmbedBuilder().setTitle("Open a ticket!");

          const reply = await interaction.followUp({
            embeds: [embed],
            components: [actionRow],
          });
          const collector = await reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
          });
          collector.on("end", () =>
            interaction.editReply({
              embeds: [],
              components: [],
              content: "Session ended.",
            })
          );

          collector.on("collect", async (buttonInter) => {
            if (buttonInter.user.bot) return;
            if (buttonInter.user.id != interaction.user.id)
              return await buttonInter.reply({
                content: "You cannot use these buttons.",
                ephemeral: true,
              });

            await buttonInter.deferReply({ ephemeral: true });
            const cID = buttonInter.customId;

            switch (cID) {
              case "ticket-title":
                const ticketReply = await buttonInter.followUp({
                  ephemeral: true,
                  content: "Enter the embed title.",
                });
                const collectorMsg1 =
                  await ticketReply.channel.createMessageCollector();
                collectorMsg1.on("collect", async (m1) => {
                  if (m1.author.id != interaction.user.id) return;
                  await buttonInter.followUp({
                    ephemeral: true,
                    content: `Set title to \`${m1.content}\``,
                  });
                  ticketEmbed.setTitle(m1.content);
                  collectorMsg1.stop();
                  m1.delete().catch(() => {});
                });
                break;

              case "ticket-desc":
                const ticketReply2 = await buttonInter.followUp({
                  ephemeral: true,
                  content: "Enter the embed description.",
                });
                const collectorMsg2 =
                  await ticketReply2.channel.createMessageCollector();
                collectorMsg2.on("collect", async (m2) => {
                  if (m2.author.id != interaction.user.id) return;
                  await buttonInter.followUp({
                    ephemeral: true,
                    content: `Set description to \`${m2.content}\``,
                  });
                  ticketEmbed.setDescription(m2.content);
                  collectorMsg2.stop();
                  m2.delete().catch(() => {});
                });
                break;

              case "ticket-color":
                const ticketReply3 = await buttonInter.followUp({
                  ephemeral: true,
                  content: "Enter the embed color.",
                });
                const collectorMsg3 =
                  await ticketReply3.channel.createMessageCollector();
                collectorMsg3.on("collect", async (m3) => {
                  if (m3.author.id != interaction.user.id) return;
                  if (!m3.content.startsWith("#") || m3.content.length != 7) {
                    buttonInter.followUp({
                      ephemeral: true,
                      content:
                        "Invalid **HEX** code.\nClick the button again to set.",
                    });
                    m3.delete().catch(() => {});
                    collectorMsg3.stop();
                    return;
                  }
                  await buttonInter.followUp({
                    ephemeral: true,
                    content: `Set color to \`${m3.content}\``,
                  });
                  ticketEmbed.setColor(m3.content);
                  collectorMsg3.stop();
                  m3.delete().catch(() => {});
                });
                break;

              case "ticket-button":
                const ticketReply4 = await buttonInter.followUp({
                  ephemeral: true,
                  content: "Enter the button text.",
                });
                const collectorMsg4 =
                  await ticketReply4.channel.createMessageCollector();
                collectorMsg4.on("collect", async (m4) => {
                  if (m4.author.id != interaction.user.id) return;
                  await buttonInter.followUp({
                    ephemeral: true,
                    content: `Set button text to \`${m4.content}\``,
                  });
                  ticketButton.setLabel(m4.content);
                  collectorMsg4.stop();
                  m4.delete().catch(() => {});
                });
                break;

              case "ticket-save":
                await buttonInter.followUp({
                  ephemeral: true,
                  content: "Saving...\nPreview Below:",
                });
                data.Embed = ticketEmbed.toJSON();
                data.Button = ticketButton.toJSON();
                await data.save();
                await buttonInter.followUp({
                  ephemeral: true,
                  embeds: [ticketEmbed],
                  components: [
                    new ActionRowBuilder().addComponents(ticketButton),
                  ],
                });
                break;
            }
          });
          break;
        default:
          break;
      }
    }
  },
};
