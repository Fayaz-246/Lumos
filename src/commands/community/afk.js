const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const userSchema = require("../../schemas/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your AFK presence")
    .addStringOption((opt) =>
      opt.setName("reason").setDescription("The reason for AFK.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { user, options, guildId, member } = interaction;
    const reason = options.getString("reason") ?? "No reason given.";
    const timestamp = `<t:${Math.floor(Date.now() / 1000)}:R>`;
    await interaction.deferReply();
    const data = await userSchema.findOne({
      GuildID: guildId,
      UserID: user.id,
    });
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setFooter({ iconURL: user.displayAvatarURL(), text: "AFK System" });

    if (data) client.cache.delete(`afk-${guildId}-${user.id}`);
    if (data) {
      if (data.afk.isAFK) {
        embed
          .setColor(client.config.errorColor)
          .setDescription("**You are already afk!**");
        return await interaction.editReply({ embeds: [embed] });
      }
      await userSchema.findOneAndUpdate(
        {
          GuildID: guildId,
          UserID: user.id,
        },
        {
          afk: {
            isAFK: true,
            timestamp: timestamp,
            reason: reason,
          },
        }
      );
    } else {
      await userSchema.create({
        GuildID: guildId,
        UserID: user.id,
        afk: { isAFK: true, timestamp: timestamp, reason: reason },
      });
    }

    embed
      .setTitle("You are now AFK!")
      .setDescription(`**Reason:** \`${reason}\`\n**Timestamp:** ${timestamp}`);

    await interaction.editReply({ embeds: [embed] });
    await member
      .setNickname(`AFK - ${user.globalName || user.username}`)
      .catch(() => {});
  },
};
