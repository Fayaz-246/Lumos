const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const economy = require("../../schemas/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Rob a user.")
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("The user you want to rob.")
        .setRequired(true)
    ),
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

    const victim = interaction.options.getUser("user");
    const data = await economy.findOneAndUpdate(
      { GuildID: interaction.guildId, UserID: interaction.user.id },
      { GuildID: interaction.guildId, UserID: interaction.user.id },
      { upsert: true, new: true }
    );
    const toRobData = await economy.findOne({
      GuildID: interaction.guildId,
      UserID: victim.id,
    });

    if (!toRobData || toRobData?.wallet <= 0)
      return await interaction.editReply({
        embeds: [
          {
            description: `Bro leave ${victim.username} alone they have 0 cash.`,
            color: parseInt(client.config.errorColor.slice(1), 16),
          },
        ],
      });

    if (data.lastRobbed && Date.now() < data.lastRobbed) {
      return await interaction.editReply({
        embeds: [
          {
            description: `Your robbing to much! You can use this command <t:${Math.floor(
              data.lastRobbed / 1000
            )}:R>`,
            color: parseInt(client.config.errorColor.slice(1), 16),
          },
        ],
      });
    }

    const chance = getNum(0, 100);
    if (chance < 60) {
      const amt = getNum(10, data.wallet);
      await interaction.editReply({
        embeds: [
          {
            description: `You tried to rob ${victim.username}, but they caught you and you've paid ${amt}`,
            color: parseInt(client.config.errorColor.slice(1), 16),
          },
        ],
      });
      data.lastRobbed = Date.now() + 1.5e6;
      data.wallet -= amt;
      toRobData.wallet += amt;
      await Promise.all([toRobData.save(), data.save()]);
      return;
    }

    const robbed = getNum(1, toRobData.wallet);
    await victim
      .send({
        embeds: [
          {
            color: parseInt(client.config.errorColor.slice(1), 16),
            description: `**You have been robbed by ${interaction.user.username} for ${robbed}.**`,
          },
        ],
      })
      .catch(() => {});

    toRobData.wallet -= robbed;
    data.wallet += robbed;
    data.lastRobbed = Date.now() + 1.5e6;
    await Promise.all([toRobData.save(), data.save()]);

    await interaction.editReply({
      embeds: [
        {
          color: parseInt(client.config.successColor.slice(1), 16),
          description: `**You have robbed ${victim.username} for ${robbed}.**`,
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
