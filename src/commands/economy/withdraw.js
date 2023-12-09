const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const userSchema = require("../../schemas/economy.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw money from your bank")
    .addIntegerOption((opt) =>
      opt
        .setName("amount")
        .setDescription("Amount to withdraw")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const amt = interaction.options.getInteger("amount");
    if (
      await client.cache.get(
        `eco-${interaction.user.id}-${interaction.guildId}`
      )
    )
      await client.cache.delete(
        `eco-${interaction.user.id}-${interaction.guildId}`
      );

    await interaction.deferReply();
    const data = await userSchema.findOne({
      GuildID: interaction.guildId,
      UserID: interaction.user.id,
    });
    if (!data)
      return await interaction.editReply({
        embeds: [{ description: "**You have no money!**", color: 0xed4245 }],
      });

    if (amt > data.bank)
      return await interaction.editReply({
        embeds: [
          {
            description:
              "**Your trying to withdraw more than you have in your bank!**",
            color: 0xed4245,
          },
        ],
      });

    data.bank -= amt;
    data.wallet += amt;
    await data.save();
    interaction.editReply({
      embeds: [
        { description: `**Withdrawn ${amt} from your bank!**`, color: 0x0000 },
      ],
    });
  },
};
