const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const userSchema = require("../../schemas/economy.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your wallet and bank balance!")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("The user to check")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({
        name: `${user.globalName || user.username}`,
        iconURL: `${user.displayAvatarURL()}`,
      })
      .setTimestamp();

    await interaction.deferReply();

    const res = await client.cache.get(`eco-${user.id}-${interaction.guildId}`);
    let data;

    if (res) {
      data = res;
    } else {
      data = await userSchema.findOne({
        GuildID: interaction.guildId,
        UserID: user.id,
      });
      client.cache.set(`eco-${user.id}-${interaction.guildId}`);
    }

    if (!data) {
      embed.setDescription("💶 Wallet: **0**\n🏦 Bank: **0**");
    } else {
      embed.setDescription(
        `💶 Wallet: **${data.wallet}**\n🏦 Bank: **${data.bank}**`
      );
    }
    await interaction.editReply({ embeds: [embed] });

    setTimeout(
      () => client.cache.delete(`eco-${user.id}-${interaction.guildId}`),
      30_000
    );
  },
};
