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
client.caches = {
  buttons: new Map(),
};

/* LOGS */
client.logs = {
  success: (text, type = "SUCCESS") =>
    console.log(`${timestamp()} `.gray + `[${type}]`.green + ` ${text}`),
  error: (text, type = "ERROR") =>
    console.log(`${timestamp()} `.gray + `[${type}]`.red + ` ${text}`),
  warn: (text, type = "WARN") =>
    console.log(`${timestamp()} `.gray + `[${type}]`.yellow + ` ${text}`),
  info: (text, type = "INFO") =>
    console.log(`${timestamp()} `.gray + `[${type}]`.blue + ` ${text}`),
};

/* ------------------------ */
if (process.argv[2] == "dev") clientLogin(process.env.Token_Dev);
else if (process.argv[2] == "prod") clientLogin(process.env.Token_Prod);
else client.logs.error("Invalid run environment.");

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
