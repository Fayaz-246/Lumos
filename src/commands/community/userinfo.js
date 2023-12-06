const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get some info on a user.")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("The user to check!")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const userCheck = options.getUser("user") ?? interaction.user;
    const memberCheck = options.getMember("user") ?? interaction.member;
    const embed = new EmbedBuilder().setColor(client.config.embedColor);
    const highestRole = memberCheck.roles.highest;
    const joinedServer = `<t:${Math.floor(
      memberCheck.joinedTimestamp / 1000
    )}:R>`;
    const joinedDiscord = `<t:${Math.floor(
      userCheck.createdTimestamp / 1000
    )}:R>`;
    const nickname = memberCheck.nickname ?? "None";
    const isBot = userCheck.bot ? "Yes" : "No";
    const isBoosting = memberCheck.premiumSince ? "Yes" : "No";

    embed
      .setTitle(`Info on ${userCheck.globalName ?? userCheck.username}`)
      .setTimestamp()
      .addFields(
        {
          name: `Username: `,
          value: `\`\`\`${userCheck.username}\`\`\``,
          inline: true,
        },
        { name: `ID: `, value: `\`\`\`${userCheck.id}\`\`\``, inline: true },
        { name: `Nickname: `, value: `\`\`\`${nickname}\`\`\``, inline: true },
        {
          name: `Joined Server: `,
          value: `${joinedServer}`,
          inline: true,
        },
        {
          name: `Joined Discord: `,
          value: `${joinedDiscord}`,
          inline: true,
        },
        { name: `Highest Role: `, value: `${highestRole}` },
        { name: "Is Bot? ", value: `${isBot}`, inline: true },
        { name: "Is Boosting? ", value: `${isBoosting}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
