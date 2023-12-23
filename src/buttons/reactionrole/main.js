const {
  ButtonInteraction,
  Client,
  RoleSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const schema = require("../../schemas/reactionrole");

module.exports = {
  data: { customId: "rr.roles" },
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @param {*} db
   */
  execute: async (interaction, client, args) => {
    const data = client.cache.get(
      `rr-${interaction.guildId}-${interaction.user.id}`
    )?.data;
    if (!data)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });
    switch (args[0]) {
      case "add":
        if (data.Roles.length == 5)
          return await interaction.reply({
            ephemeral: true,
            content:
              "You cannot add more roles to the panel as this server has reached it's max of 5.",
          });
        const role = new RoleSelectMenuBuilder()
          .setCustomId("rr.add")
          .setMinValues(1)
          .setMaxValues(1);
        await interaction.update({
          components: [new ActionRowBuilder().addComponents(role)],
        });
        break;
      case "remove":
        const select = new StringSelectMenuBuilder()
          .setCustomId("rr.remove")
          .setMinValues(1)
          .setMaxValues(1)
          .setOptions(
            data.Roles.map((x) => {
              const role = interaction.guild.roles.cache.get(x.role);

              return {
                label: `${role.name}`,
                description: `Remove the ${role.name} from the panel.`,
                value: `${role.id}`,
              };
            })
          );
        await interaction.update({
          components: [new ActionRowBuilder().addComponents(select)],
        });
        break;
    }
  },
};
