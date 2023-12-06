require("colors");
const { Client, Interaction, EmbedBuilder } = require("discord.js");
const formatStr = require("../../utils/formatStr");

/**
 *
 * @param {Interaction} interaction
 * @param {Client} client
 */
module.exports = async (client, interaction) => {
  if (!interaction.guild)
    return interaction.reply({
      content: "Slash commands can only be used in guilds",
    });

  if (!interaction.isCommand()) return;
  const { commands, cooldowns, config } = client;
  const { errorColor } = config;
  const command = commands.get(interaction.commandName);

  if (!command) return;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Map());
  }
  const now = Date.now();
  const ts = cooldowns.get(command.data.name);
  const cdAmt = (command.cooldown ?? 0) * 1000;

  if (ts.has(interaction.user.id)) {
    const exTime = ts.get(interaction.user.id) + cdAmt;

    if (now < exTime) {
      const exedTs = `<t:${Math.floor(exTime / 1000)}:R>`;
      const embedDesc =
        command.cdEmbed ||
        `You are on cooldown, you can use this command {ts}!`;
      return await interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(errorColor)
            .setDescription(embedDesc.replace("{ts}", exedTs))
            .setAuthor({
              iconURL: interaction.user.displayAvatarURL(),
              name: `${formatStr(command.data.name)} Command!`,
            }),
        ],
      });
    }
  }

  ts.set(interaction.user.id, now);
  setTimeout(() => ts.delete(interaction.user.id), cdAmt);

  const embed = new EmbedBuilder();

  if (command.memberPerms) {
    if (!interaction.member.permissions.has(command.memberPerms)) {
      return await interaction.reply({
        embeds: [
          embed
            .setColor(config.errorColor)
            .setDescription(
              `${config.emojis.error} **You do not have permission to use this command.**`
            ),
        ],
        ephemeral: true,
      });
    }
  }

  const bot = interaction.guild.members.me;

  if (command.botPerms) {
    if (!bot.permissions.has(command.botPerms)) {
      return await interaction.reply({
        embeds: [
          embed
            .setColor(config.errorColor)
            .setDescription(
              `${config.emojis.error} **I do not have permission to execute this command.**`
            ),
        ],
        ephemeral: true,
      });
    }
  }

  if (command.private) {
    if (interaction.guildId != "1155536013511377028")
      return await interaction.reply({
        embeds: [
          embed
            .setColor(config.errorColor)
            .setDescription(
              `${config.emojis.error} **This command is only for [Discord Bot Hub!](https://discord.gg/xbrYnd9dqe)**`
            ),
        ],
        ephemeral: true,
      });
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    client.logs.error(`${command.data.name} Command Error - \n${error.stack}`);
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    await interaction
      .editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.errorColor)
            .setTitle("An Error Occured While Using This Command.")
            .setDescription(
              `Please report this error: \n\`\`\`js\n${error.stack}\`\`\``
            ),
        ],
        ephemeral: true,
      })
      .catch(() => {});
  }
};
