const {
  ButtonInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const reactionrole = require("../schemas/reactionrole");

module.exports = {
  data: { customId: "reaction.add" },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @param {String[]} args
   */
  execute: async (interaction, client, args) => {
    await interaction.deferReply({ ephemeral: true });
    const data = await reactionrole.findOne({ GuildID: interaction.guildId });
    if (!data) return await interaction.editReply("🛠️ Something went wrong...");
    const roleHas = interaction.member.roles.cache.has(args[0]);
    const reply = roleHas
      ? `Removed <@&${args[0]}> from your roles.`
      : `Added <@&${args[0]}> to your roles.`;
    const action = roleHas ? "remove" : "add";
    const role = interaction.guild.roles.cache.get(`${args[0]}`);

    interaction.member.roles[action](role);
    await interaction.editReply(reply);
  },
};
