require("dotenv/config");
require("colors");

const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { readdirSync } = require("fs");
const timestamp = require("./utils/timestamp.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
});
client.commands = new Collection();
client.buttons = new Collection();
client.autocomplete = new Collection();
client.config = require("./config.js");

const handlerFolder = readdirSync("./src/handlers", { withFileTypes: true });

/* CACHE */
client.cache = new Map();
client.cooldowns = new Collection();

/* LOGS */
client.logs = {};
client.logs.success = (text, type = "SUCCESS") => {
  return console.log(`${timestamp()} `.gray + `[${type}]`.green + ` ${text}`);
};
client.logs.error = (text, type = "ERROR") => {
  return console.log(`${timestamp()} `.gray + `[${type}]`.red + ` ${text}`);
};
client.logs.warn = (text, type = "WARN") => {
  return console.log(`${timestamp()} `.gray + `[${type}]`.yellow + ` ${text}`);
};
client.logs.info = (text, type = "INFO") => {
  return console.log(`${timestamp()} `.gray + `[${type}]`.blue + ` ${text}`);
};

/* ------------------------ */
clientLogin(process.env.Token);

function clientLogin(token) {
  client.login(token).then(() => {
    handlerFolder.forEach((handler) => {
      if (handler.isFile()) {
        const handlerFile = require(`./handlers/${handler.name}`);
        handlerFile(client);
      } else {
        const handlerFiles = readdirSync(`${handler.path}/${handler.name}`);
        handlerFiles.forEach((file) => {
          const fileExec = require(`./handlers/${handler.name}/${file}`);
          fileExec(client);
        });
      }
    });
  });
}
