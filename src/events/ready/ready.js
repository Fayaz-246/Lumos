require("colors");
const { Client, ActivityType } = require("discord.js");
const si = require("systeminformation");

/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
  if (process.argv[2] == "dev")
    console.log(
      `${client.tables.commands}\n\n${client.tables.buttons}\n\n${client.tables.menus}`
    );

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

  /*let i = 0;
  setTimeout(() => {
    for (const c of client.commandArray) {
      i++;
      console.log(c);
      if (c.options) {
        c.options.forEach((s) => {
          if (s.type == 1) i++;
          else if (s.type == 2) {
            console.log(s);
            s.options.forEach((sc) => {
              if (sc.type == 1) i++;
            });
          }
        });
      }
    }
    console.log(i);
  }, 5_000);  This is for total command count ( including subcommands )*/
};
