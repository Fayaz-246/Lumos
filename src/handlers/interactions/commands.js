require("colors");
const { readdirSync } = require("fs");
const AsciiTable = require("ascii-table");
const formatStr = require("../../utils/formatStr");
/**
 *
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
  const commandFolders = readdirSync("./src/commands");
  client.commandArray = [];

  const table = new AsciiTable()
    .setTitle("COMMANDS")
    .setHeading("Name", "Folder", "Status");

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./src/commands/${folder}`).filter(
      (file) => file.endsWith(".js")
    );
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      if ("data" in command && "execute" in command) {
        client.commands.set(
          command.data.name,
          Object.assign(command, { folder })
        );
        client.commandArray.push(command.data.toJSON());
        table.addRow(command.data.name, formatStr(command.folder), "✅");
      } else {
        client.logs.warn(`${file} is missing "data" or "execute".`);
        table.addRow(file, formatStr(folder), "❌");
      }
    }
  }

  (async () => {
    try {
      client.logs.error(
        `Started refrshing ${client.commandArray.length} application ( / ) commands`,
        "CMDS"
      );

      client.application.commands.set(client.commandArray);

      client.logs.success(
        `Successfully ${client.commandArray.length} refreshed application ( / ) commands`,
        "CMDS"
      );
      client.tables.commands = table.toString();
    } catch (error) {
      client.logs.error(
        `Error while registring application commands: \n${error.stack}`
      );
    }
  })();
};
