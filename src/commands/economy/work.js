const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const economy = require("../../schemas/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work for some money!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    if (
      await client.cache.get(
        `eco-${interaction.user.id}-${interaction.guildId}`
      )
    )
      await client.cache.delete(
        `eco-${interaction.user.id}-${interaction.guildId}`
      );

    let data = await economy.findOne({
      GuildID: interaction.guildId,
      UserID: interaction.user.id,
    });
    if (!data)
      data = await economy.create({
        GuildID: interaction.guildId,
        UserID: interaction.user.id,
      });

    if (data.lastWorked && Date.now() < data.lastWorked) {
      return await interaction.editReply({
        embeds: [
          {
            description: `Your working to much! You can use this command <t:${Math.floor(
              data.lastWorked / 1000
            )}:R>`,
            color: 0x0000,
          },
        ],
      });
    }

    const amt = getNum(25, 175);
    data.wallet += amt;
    data.lastWorked = Date.now() + 300_000;
    await data.save();
    await interaction.editReply({
      embeds: [
        {
          description: `You've worked and got ${amt} 💶`,
          color: 0x0000,
        },
      ],
    });
  },
};

function getNum(x, y) {
  const range = y - x + 1;
  const z = Math.floor(Math.random() * range);
  return z + x;
}
