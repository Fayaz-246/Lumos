require("colors");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const weather = require("weather-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Check the weather.")
    .addStringOption((opt) =>
      opt
        .setName("location")
        .setDescription("The location to check")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Select the type of degree")
        .addChoices(
          { name: "Celcuis", value: "C" },
          { name: "Farenheit", value: "F" }
        )
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const location = options.getString("location");
    const type = options.getString("type");

    await interaction.reply({
      ephemeral: true,
      content: "<a:loading:1176158946805944341> Fetching your weather data...",
    });

    await weather.find(
      { search: `${location}`, degreeType: `${type}` },
      async (err, res) => {
        setTimeout(async () => {
          if (err) {
            console.log("[WEATHER-JS] ".red + `ERR - ${err}`);
            await interaction.editReply({
              content:
                "<a:alert:1176159881468854374> API Timedout, please re-use the command!",
            });
            return;
          }

          if (res.length == 0)
            return await interaction.editReply({
              content: `I could not find the weather of ${location}...`,
            });

          const temp = res[0].current.temperature;
          const skyText = res[0].current.skytext;
          const name = res[0].location.name;
          const feel = res[0].current.feelslike;
          const icon = res[0].current.imageUrl;
          const wind = res[0].current.winddisplay;
          const alert = res[0].location.alert || "None";
          const day = res[0].current.day;

          const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setAuthor({
              iconURL: `${interaction.user.displayAvatarURL()}`,
              name: `Requested By: ${
                interaction.user.globalName || interaction.user.username
              }`,
            })
            .setThumbnail(icon)
            .setTitle(`Current weather of ${name}`)
            .addFields(
              { name: "Temperature: ", value: `\`${temp}\``, inline: true },
              { name: "Feels Like: ", value: `\`${feel}\``, inline: true },
              { name: "Weather: ", value: `\`${skyText}\``, inline: true },
              { name: "Week Day: ", value: `\`${day}\``, inline: true },
              {
                name: "Wind Speed & Direction: ",
                value: `\`${wind}\``,
                inline: true,
              },
              { name: "Alerts: ", value: `\`${alert}\``, inline: true }
            );

          await interaction.editReply({ content: "", embeds: [embed] });
        }, 2_000);
      }
    );
  },
};
