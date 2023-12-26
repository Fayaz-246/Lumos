const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const economy = require("../../schemas/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money you brokie"),
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

    if (data.lastBegged && Date.now() < data.lastBegged) {
      return await interaction.editReply({
        embeds: [
          {
            description: `Your begging to much! You can use this command <t:${Math.floor(
              data.lastBegged / 1000
            )}:R>`,
            color: 0x0000,
          },
        ],
      });
    }

    const chance = getNum(0, 100);
    if (chance < 40) {
      await interaction.editReply({
        embeds: [
          {
            description: `You've begged and got nothing :(`,
            color: 0x0000,
          },
        ],
      });
      data.lastBegged = Date.now() + 300_000;
      await data.save();
      return;
    }

    const amt = getNum(10, 150);
    data.wallet += amt;
    data.lastBegged = Date.now() + 300_000;
    await data.save();
    await interaction.editReply({
      embeds: [
        {
          description: `You've begged and got ${amt} 💶`,
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
