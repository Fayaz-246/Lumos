require("colors");
const { Client, ActivityType } = require("discord.js");
const timestamp = require("../../utils/timestamp");
const si = require("systeminformation");

/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
  client.logs.info(`${client.user.username} is online!`);
  client.user.setPresence({
    activities: [{ name: "/help", type: ActivityType.Playing }],
  });

  try {
    const cpuInfo = await si.cpu();
    client.logs.info(`CPU Type: ${cpuInfo.manufacturer}-${cpuInfo.brand}`);
    client.cpu = `${cpuInfo.manufacturer}-${cpuInfo.brand}`;

    const memInfo = await si.memLayout();
    memInfo.forEach((m, i) =>
      client.logs.info(
        `RAM Slot ${i + 1}: ${m.manufacturer || "Unkown"} ${m.partNum}`
      )
    );

    const gpuInfo = await si.graphics();
    gpuInfo.controllers.forEach((g, i) =>
      client.logs.info(`GPU ${i + 1}: ${g.model}`)
    );
  } catch (error) {
    client.logs.error(error);
  }
};
