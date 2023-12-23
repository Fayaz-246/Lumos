const {
  RoleSelectMenuInteraction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const schema = require("../../schemas/reactionrole");

module.exports = {
  data: { customId: "rr.add" },
  /**
   *
   * @param {RoleSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const data = await schema.findOne({ GuildID: interaction.guildId });
    if (!interaction.values.length)
      return interaction.reply({
        ephemeral: true,
        content:
          "You have emptied your selection please pick atleast one role.",
      });

    const bot = interaction.guild.members.me;
    const role = interaction.guild.roles.cache.get(`${interaction.values[0]}`);
    if (role.position >= bot.roles.highest.position) {
      await interaction.update({
        components: [interaction.message.components[0]],
      });
      return interaction.followUp({
        ephemeral: true,
        content: "You cannot use this role as it is higher than mine.",
      });
    }

    const find = data.Roles.find((x) => x.role == interaction.values[0]);
    if (find) {
      await interaction.update({
        components: [interaction.message.components[0]],
      });
      return interaction.followUp({
        ephemeral: true,
        content:
          "You cannot use this role as it is already added to the panel.",
      });
    }

    await interaction.update({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("rr.radd-blue")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Blue"),
          new ButtonBuilder()
            .setCustomId("rr.radd-red")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Red"),
          new ButtonBuilder()
            .setCustomId("rr.radd-green")
            .setStyle(ButtonStyle.Success)
            .setLabel("Green"),
          new ButtonBuilder()
            .setCustomId("rr.radd-grey")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Grey")
        ),
      ],
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTimestamp()
          .setFooter({
            iconURL: interaction.guild.iconURL(),
            text: `${interaction.guild.name} Reaction Role Config`,
          })
          .setTitle("Pick the role button color."),
      ],
    });
    client.cache.set(`radd-${interaction.user.id}`, { role: role.id });
  },
};
