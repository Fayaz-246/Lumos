require("colors");
const { Client, ActivityType } = require("discord.js");
const timestamp = require("../../utils/timestamp");
const si = require("systeminformation");

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
  client.logs.info(`${client.user.username} is online!`);
  client.user.setPresence({
    activities: [{ name: "/help", type: ActivityType.Playing }],
  });
  si.cpu()
    .then((data) => {
      client.logs.info(`CPU Type: ${data.manufacturer}-${data.brand}`);
      client.cpu = `${data.manufacturer}-${data.brand}`;
    })
    .catch((error) => {
      client.logs.error(`Error fetching CPU information: ${error}`);
    });
};
