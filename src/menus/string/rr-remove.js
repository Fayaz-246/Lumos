const { StringSelectMenuInteraction, Client } = require("discord.js");
const reactionrole = require("../../schemas/reactionrole");

module.exports = {
  data: { customId: "rr.remove" },
  /**
   *
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferUpdate();
    const data = await reactionrole.findOne({ GuildID: interaction.guildId });
    const roleId = interaction.values[0];
    const filter = data.Roles.filter((x) => x.role != roleId);
    data.Roles = filter;
    await data.save();
    await interaction.editReply({
      embeds: [],
      components: [],
      content: `Removed <@&${roleId}> from the role panel!`,
    });
  },
};
