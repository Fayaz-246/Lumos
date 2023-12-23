const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const schema = require("../../schemas/reactionrole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reaction-role")
    .setDescription("Configure the reaction role system")
    .addSubcommand((sub) =>
      sub.setName("enable").setDescription("Enable the system!")
    )
    .addSubcommand((sub) =>
      sub.setName("disable").setDescription("Disable the system")
    )
    .addSubcommandGroup((g) =>
      g
        .setName("panel")
        .setDescription("Edit the panel")
        .addSubcommand((sub) =>
          sub.setName("embed").setDescription("Edit the panel embed")
        )
        .addSubcommand((sub) =>
          sub
            .setName("roles")
            .setDescription("Add or Remove roles from the panel")
        )
        .addSubcommand((sub) =>
          sub.setName("send").setDescription("Send the panel")
        )
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const data = await schema.findOne({ GuildID: interaction.guildId });
    const { options } = interaction;
    const group = options.getSubcommandGroup();
    const sub = options.getSubcommand();

    if (group) {
      if (!data)
        return await interaction.editReply(
          "The `reaction role` system is not setup in this server."
        );
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTimestamp()
        .setFooter({
          iconURL: interaction.guild.iconURL(),
          text: `${interaction.guild.name} Reaction Role Config`,
        });
      switch (sub) {
        case "send":
          if (data.Roles?.length == 0 || !data.Roles)
            return await interaction.editReply(
              "The `reaction role` system is setup, but no roles have been added to the panel."
            );

          const buttons = {
            type: 1,
            components: data.Roles.map((x) => {
              return {
                type: 2,
                style: x.Button.style,
                label: x.Button.label,
                custom_id: x.Button.customId,
                emoji: undefined,
              };
            }),
          };

          interaction.channel.send({
            embeds: [
              {
                title: data.Embed.title,
                description: data.Embed.description,
                color: data.Embed.color,
                timestamp: data.Embed.timestamp
                  ? new Date().toISOString()
                  : null,
              },
            ],
            components: [buttons],
          });
          await interaction.editReply("sent!");
          break;
        /* ----------------- */
        case "roles":
          client.cache.set(`rr-${interaction.guildId}-${interaction.user.id}`, {
            data,
          });

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("rr.roles-add")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:plus:1186581658988707922>")
              .setLabel("Add"),
            new ButtonBuilder()
              .setCustomId("rr.roles-remove")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:remove:1187359466665029763>")
              .setLabel("Remove")
          );

          await interaction.editReply({
            embeds: [embed.setTitle("✏️ Add / Remove Roles")],
            components: [row],
          });
          break;

        case "embed":
          client.cache.set(
            `rr-embed-${interaction.guildId}-${interaction.user.id}`,
            { data }
          );
          const embedConfigEmbed = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("rr.embed-title")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:pencil:1187723092420730941>")
              .setLabel("Title"),
            new ButtonBuilder()
              .setCustomId("rr.embed-desc")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:pencil:1187723092420730941>")
              .setLabel("Description"),
            new ButtonBuilder()
              .setCustomId("rr.embed-color")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:pencil:1187723092420730941>")
              .setLabel("Color"),
            new ButtonBuilder()
              .setCustomId("rr.embed-ts")
              .setStyle(
                data.Embed.timestamp == false
                  ? ButtonStyle.Danger
                  : ButtonStyle.Success
              )
              .setEmoji(
                data.Embed.timestamp == false
                  ? "<:disable:1187712887356133477>"
                  : "<:enable:1187712882104860684>"
              )
              .setLabel("Timestamp")
          );
          await interaction.editReply({
            embeds: [embed.setTitle("✏️ Edit The Panel Embed")],
            components: [
              embedConfigEmbed,
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("rr.embed-preview")
                  .setStyle(ButtonStyle.Primary)
                  .setEmoji("<:preview:1187724802950180894>")
                  .setLabel("Preview")
              ),
            ],
          });
          break;
      }
    } else {
      if (sub == "disable") {
        if (!data)
          return await interaction.editReply(
            "The `reaction role` system is not setup in this server."
          );
        await schema.findOneAndDelete({ GuildID: interaction.guildId });
        await interaction.editReply(
          "Disabled `reaction role` system in this server."
        );
      } else {
        if (data)
          return await interaction.editReply(
            "The `reaction role` system already setup, use `/reactionrole panel` to edit the panel."
          );
        await schema.create({
          GuildID: interaction.guildId,
        });
        await interaction.editReply(
          "Enabled `reaction role` system in this server!"
        );
      }
    }
  },
};
