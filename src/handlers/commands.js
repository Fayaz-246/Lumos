require("colors");
const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
const timestamp = require("../utils/timestamp");

module.exports = (client) => {
  const commandFolders = readdirSync("./src/commands");
  client.commandArray = [];

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./src/commands/${folder}`).filter(
      (file) => file.endsWith(".js")
    );
    for (const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);
      if ("data" in command && "execute" in command) {
        const properties = { folder, ...command };
        client.commands.set(command.data.name, properties);
        client.commandArray.push(command.data.toJSON());
      } else {
        client.logs.warn(`${file} is missing "data" or "execute".`);
      }
    }
  }

  const rest = new REST({
    version: "10",
  }).setToken(process.env.Token);

  (async () => {
    try {
      client.logs.error(
        `Started refrshing ${client.commandArray.length} application ( / ) commands`,
        "CMDS"
      );

      await rest.put(Routes.applicationCommands(process.env.ClientID), {
        body: client.commandArray,
      });

      client.logs.success(
        `Successfully ${client.commandArray.length} refreshed application ( / ) commands`,
        "CMDS"
      );
    } catch (error) {
      client.logs.error(
        `Error while registring application commands: \n${error.stack}`
      );
    }
  })();
};
