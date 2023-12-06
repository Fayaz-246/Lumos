const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");
const warnsSchema = require("../../schemas/warns");

module.exports = {
  memberPerms: PermissionsBitField.Flags.ModerateMembers,
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Fully fledged warning system.")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a warning to a user.")
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("The user to warn.")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("reason")
            .setDescription("The reason for the warn.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List a users warnings.")
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("The user to check.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("clear")
        .setDescription("Clear a users warnings.")
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("The user to clear warns.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a warning from a user.")
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("The user to remove a warn from.")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("id")
            .setDescription("The warning ID")
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(5)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, guildId, guild } = interaction;
    const subCommand = options.getSubcommand([
      "add",
      "list",
      "clear",
      "remove",
    ]);
    const user = options.getUser("user");
    const reason = options.getString("reason");
    const removeWarnID = options.getString("id");

    const { embedColor, successColor, errorColor, emojis } = client.config;
    const embed = new EmbedBuilder();
    const data = await warnsSchema.findOne({
      GuildID: guildId,
      UserID: user.id,
    });

    async function getData() {
      if (!data) {
        embed
          .setColor(successColor)
          .setDescription(`** ${emojis.success} This user has no warnings!**`);
        await interaction.editReply({ embeds: [embed] });
      }
      return data;
    }

    async function warnLength() {
      if (data.List.length == 0) {
        embed
          .setColor(successColor)
          .setDescription(`** ${emojis.success} This user has no warnings!**`);
        await interaction.editReply({ embeds: [embed] });
        return false;
      }
      return true;
    }

    await interaction.deferReply();

    switch (subCommand) {
      case "add":
        const ts = `<t:${Math.floor(Date.now() / 1000)}:d>`;
        if (!data) {
          await warnsSchema.create({
            GuildID: guildId,
            UserID: user.id,
            List: [
              {
                Reason: reason,
                Moderator: interaction.user.id,
                Timestamp: ts,
                ID: genID(5),
              },
            ],
          });
        } else {
          data.List.push({
            Reason: reason,
            Moderator: interaction.user.id,
            Timestamp: ts,
            ID: genID(5),
          });
          await data.save();
        }
        embed
          .setColor(successColor)
          .setTitle("Warned Member.")
          .addFields(
            {
              name: "User: ",
              value: `\`\`\`${user.username}\`\`\``,
              inline: true,
            },
            { name: "UserID: ", value: `\`\`\`${user.id}\`\`\``, inline: true },
            { name: "Reason: ", value: `\`\`\`${reason}\`\`\``, inline: true },
            {
              name: "Moderator: ",
              value: `\`\`\`${interaction.user.username}\`\`\``,
              inline: true,
            },
            { name: "Timestamp: ", value: `${ts}`, inline: true }
          );
        await interaction.editReply({ embeds: [embed] });
        embed
          .setColor(errorColor)
          .setTitle("You have been warned.")
          .setFields()
          .setDescription(
            `**You have been warned in \`${guild.name}\` by \`${interaction.user.username}\`\nReason:** \`${reason}\``
          );
        await user.send({ embeds: [embed] }).catch(() => {});
        break;

      case "list":
        if (!(await getData())) return;
        if (!(await warnLength())) return;
        const dataList = data.List.map((w) => {
          return `**Reason:** \`${w.Reason}\`\n**Moderator:** <@${w.Moderator}> \`[${w.Moderator}]\`\n**Timestamp:** ${w.Timestamp}\n**ID:** ${w.ID}`;
        }).join("\n\n");
        embed
          .setColor(embedColor)
          .setTitle(`${user.username}'s warnings: `)
          .setDescription(`${dataList}`);

        await interaction.editReply({ embeds: [embed] });
        break;

      case "clear":
        if (!(await getData())) return;
        await warnsSchema.findOneAndDelete({
          GuildID: guildId,
          UserID: user.id,
        });
        embed
          .setColor(successColor)
          .setDescription(
            `**${emojis.success} Cleared ${user.username}'s warnings.**`
          );
        await interaction.editReply({ embeds: [embed] });
        break;

      case "remove":
        if (!(await getData())) return;
        if (!(await warnLength())) return;
        const find = data.List.find((x) => x.ID === removeWarnID);
        if (!find)
          return await interaction.editReply({
            content: `Invalid ID.\nValid ID's for ${
              user.username
            }: ${data.Content.map((x) => x.ID).join(" | ")}`,
          });
        let filteredData = data.List.filter((x) => x != find);
        data.List = filteredData;
        await data.save();
        embed
          .setColor(successColor)
          .setDescription(
            `**Removed warn with ID - \`${removeWarnID}\`, from \`${user.username}\`.**`
          );
        await interaction.editReply({ embeds: [embed] });
        break;
    }
  },
};

function genID(maxLength) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < maxLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
