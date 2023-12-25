const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  botPerms: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Configure the automod system!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("flagged-words")
        .setDescription("Block profanity, sexual content and slurs")
    )
    .addSubcommand((sub) =>
      sub
        .setName("spam-messages")
        .setDescription("Block messages suspected of spam")
    )
    .addSubcommand((sub) =>
      sub
        .setName("mention-spam")
        .setDescription(
          "Block messages containing a certain amount of mentions"
        )
        .addIntegerOption((opt) =>
          opt
            .setName("number")
            .setDescription("The amount of mentions per message")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("keyword")
        .setDescription("Block a given keyword in the server")
        .addStringOption((opt) =>
          opt
            .setName("word")
            .setDescription("The word you want to block.")
            .setRequired(true)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    await interaction.deferReply({ ephemeral: true });
    const subCommand = options.getSubcommand();
    switch (subCommand) {
      case "flagged-words":
        await interaction.editReply({
          embeds: [
            {
              description:
                "<a:lumos_loading:1188854940425269368> Loading your automod rule...",
              color: parseInt(client.config.loadingColor.slice(1), 16),
            },
          ],
        });

        const rule = guild.autoModerationRules.create({
          name: "Block profanity, sexual content and slurs by Lumos",
          creatorId: `${client.user.id}`,
          enabled: true,
          eventType: 1,
          triggerType: 4,
          triggerMetadata: {
            presets: [1, 2, 3],
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                durationSeconds: 10,
                customMessage: `This message was blocked by ${client.user.username}'s auto moderations system.`,
              },
            },
          ],
        });

        setTimeout(async () => {
          if (!rule) return;
          await interaction.editReply({
            embeds: [
              {
                description: `${client.config.emojis.success} Your automod rule has been created! All swears will be blocked.`,
                color: parseInt(client.config.successColor.slice(1), 16),
              },
            ],
          });
        }, 3000);

        break;

      case "keyword":
        await interaction.editReply({
          embeds: [
            {
              description:
                "<a:lumos_loading:1188854940425269368> Loading your automod rule...",
              color: parseInt(client.config.loadingColor.slice(1), 16),
            },
          ],
        });
        const word = options.getString("word");

        const rule2 = guild.autoModerationRules.create({
          name: `Prevent the word "${word}" from being used by Lumos`,
          creatorId: `${client.user.id}`,
          enabled: true,
          eventType: 1,
          triggerType: 1,
          triggerMetadata: {
            keywordFilter: [word],
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                durationSeconds: 10,
                customMessage: `This message was blocked by ${client.user.username}'s auto moderations system.`,
              },
            },
          ],
        });

        setTimeout(async () => {
          if (!rule2) return;
          await interaction.editReply({
            embeds: [
              {
                description: `${client.config.emojis.success} Your automod rule has been created! All messages containing \`${word}\` will be blocked.`,
                color: parseInt(client.config.successColor.slice(1), 16),
              },
            ],
          });
        }, 3000);
        break;

      case "mention-spam":
        await interaction.editReply({
          embeds: [
            {
              description:
                "<a:lumos_loading:1188854940425269368> Loading your automod rule...",
              color: parseInt(client.config.loadingColor.slice(1), 16),
            },
          ],
        });

        const number = options.getInteger("number");
        const rule3 = guild.autoModerationRules.create({
          name: "Prevent spam messages by Lumos",
          creatorId: `${client.user.id}`,
          enabled: true,
          eventType: 1,
          triggerType: 5,
          triggerMetadata: {
            mentionTotalLimit: number,
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                durationSeconds: 10,
                customMessage: `This message was blocked by ${client.user.username}'s auto moderations system.`,
              },
            },
          ],
        });

        setTimeout(async () => {
          if (!rule3) return;
          await interaction.editReply({
            embeds: [
              {
                description: `${client.config.emojis.success} Your automod rule has been created! All messages with over ${number} mentions will be blocked.`,
                color: parseInt(client.config.successColor.slice(1), 16),
              },
            ],
          });
        }, 3000);
        break;

      case "spam-messages":
        await interaction.editReply({
          embeds: [
            {
              description:
                "<a:lumos_loading:1188854940425269368> Loading your automod rule...",
              color: parseInt(client.config.loadingColor.slice(1), 16),
            },
          ],
        });

        const rule4 = guild.autoModerationRules.create({
          name: "Prevent spam messages by Lumos",
          creatorId: `${client.user.id}`,
          enabled: true,
          eventType: 1,
          triggerType: 3,
          triggerMetadata: {},
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                durationSeconds: 10,
                customMessage: `This message was blocked by ${client.user.username}'s auto moderations system.`,
              },
            },
          ],
        });

        setTimeout(async () => {
          if (!rule4) return;
          await interaction.editReply({
            embeds: [
              {
                description: `${client.config.emojis.success} Your automod rule has been created! All messages suspected of spam will be blocked.`,
                color: parseInt(client.config.successColor.slice(1), 16),
              },
            ],
          });
        }, 3000);
        break;
    }
  },
};
