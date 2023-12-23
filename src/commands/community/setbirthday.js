const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  AutocompleteInteraction,
} = require("discord.js");
const birthdays = require("../../schemas/birthday");
const user = require("../../schemas/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-birthday")
    .setDescription("Set your birthday in this server")
    .addStringOption((o) =>
      o
        .setName("date")
        .setDescription("Your birthday!")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    if (!(await birthdays.findOne({ GuildID: interaction.guildId })))
      return await interaction.editReply(
        "Sadly, this server does not have the birthday system setup."
      );

    const date = parseInt(interaction.options.getString("date"));
    const data = await user.findOne({
      GuildID: interaction.guildId,
      UserID: interaction.user.id,
    });
    if (data) {
      data.birthday = date;
      await data.save();
      await interaction.editReply(
        `Set your birthday to \`${interaction.options.getString(
          "date"
        )}\` [${date}]`
      );
    } else {
      await user.create({
        GuildID: interaction.guildId,
        UserID: interaction.user.id,
        birthday: date,
      });
      await interaction.editReply(
        `Set your birthday to \`${interaction.options.getString("date")}\``
      );
    }
  },

  /**
   *
   * @param {AutocompleteInteraction} interaction
   */
  autocomplete: async (interaction) => {
    const regex = /^\d+$/;
    const givenDate = interaction.options.getFocused();
    if (!regex.test(givenDate)) {
      const converted = convertDate(givenDate);
      const dArry = new Date(converted).toDateString().split(" ");
      const res = converted ? `${dArry[1]} ${dArry[2]}` : `Invalid Date`;

      await interaction.respond([{ name: res, value: `${converted}` }]);
    } else {
      await interaction.respond([
        { name: "Invalid date.", value: "Invalid Date." },
      ]);
    }
  },
};

function convertDate(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    const formattedDateStr = dateString.replace(/(\b[a-z](?!\s))/g, (x) =>
      x.toUpperCase()
    );
    const correctedDate = new Date(formattedDateStr);

    if (isNaN(correctedDate.getTime())) return false;

    return Math.floor(correctedDate.getTime());
  }
  return Math.floor(date.getTime());
}
