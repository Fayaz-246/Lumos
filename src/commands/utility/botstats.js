const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const pkgJSON = require("../../../package.json");
const os = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botstats")
    .setDescription("Gives some info on the bot!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({
        iconURL: `${client.user.displayAvatarURL()}`,
        name: `${client.user.username}`,
      })
      .setTimestamp();
    const memoryUsage = process.memoryUsage();
    const totalMemoryBytes = os.totalmem();
    let osx = os.type();
    osx == "Windows_NT" ? (osx = "Windows") : osx;

    const cpuUsage = os.cpus();
    const totalCpuTime = cpuUsage.reduce(
      (acc, cpu) =>
        acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle,
      0
    );
    const idleCpuTime = cpuUsage.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const cpuUsagePercentage =
      ((totalCpuTime - idleCpuTime) / totalCpuTime) * 100;

    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    const uptime = `${days} ${days > 1 ? "Days" : "Day"}, ${hours} ${
      hours > 1 ? "Hours" : "Hour"
    }, ${minutes} ${minutes > 1 ? "Minutes" : "Minute"} & ${seconds} ${
      seconds > 1 ? "Seconds" : "Second"
    }`;

    embed.setDescription(
      `Bot ID: \`${
        client.user.id
      }\`\n\n**Dev Info**\nDiscord.js Version: \`${pkgJSON.dependencies[
        "discord.js"
      ].replace("^", "")}\`\nCPU Usage: \`${cpuUsagePercentage.toFixed(2)}% | ${
        client.cpu
      }\`\nMemory Usage: \`${
        Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100
      } MB / ${
        Math.round((totalMemoryBytes / (1024 * 1024 * 1024)) * 100) / 100
      } GB\`\nOS: \`${osx}\`\n\n**General Info**\nTotal Servers: \`${
        client.guilds.cache.size
      }\`\nTotal Commands: \`${client.commands.size}\`\nUptime: \`${uptime}\``
    );

    await interaction.reply({ embeds: [embed] });
  },
};
