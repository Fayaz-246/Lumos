const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");
const { default: axios } = require("axios");

module.exports = {
  memberPerms: PermissionsBitField.Flags.ManageGuildExpressions,
  botPerms: PermissionsBitField.Flags.ManageGuildExpressions,
  data: new SlashCommandBuilder()
    .setName("steal")
    .setDescription("Steal an emoji!")
    .addStringOption((opt) =>
      opt
        .setName("emoji")
        .setDescription("The emoji you want to steal.")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("name")
        .setDescription("The name of the added emoji.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { embedColor, emojis } = client.config;

    let emoji = interaction.options.getString("emoji")?.trim();
    const name = interaction.options.getString("name");

    if (emoji.startsWith("<") && emoji.endsWith(">")) {
      const id = emoji.match(/\d{15,}/g)[0];

      const type = await axios
        .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
        .then((img) => {
          if (img) return "gif";
          else return "png";
        })
        .catch(() => {
          return "png";
        });

      emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
    }

    if (!emoji.startsWith("http"))
      return interaction.reply({
        ephemeral: true,
        content: "You cannot steal defualt emojis!",
      });

    if (!emoji.startsWith("https"))
      return interaction.reply({
        ephemeral: true,
        content: "You cannot steal defualt emojis!",
      });

    interaction.guild.emojis
      .create({ attachment: `${emoji}`, name: `${name}` })
      .then(async (em) => {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColor)
              .setTitle("Emoji Added!")
              .setDescription(`Added ${em} with name \`:${name}:\`!`),
          ],
        });
      })
      .catch(async (e) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        interaction
          .editReply({
            ephemeral: true,
            content: `You cannot add more emojis as this server has reached it's limit.\n\n\`\`\`js\n${e}\`\`\``,
          })
          .catch(() => {});
      });
  },
};
