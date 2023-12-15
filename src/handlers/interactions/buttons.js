const { readdirSync } = require("fs");

module.exports = (client) => {
  const { buttons: btns } = client;
  const buttonFiles = readdirSync(`./src/buttons`, { withFileTypes: true }); //.filter((f) => f.endsWith(".js"));
  for (const file of buttonFiles) {
    if (file.isDirectory()) {
      const buttons = readdirSync(`./src/buttons/${file.name}`).filter((f) =>
        f.endsWith(".js")
      );
      for (const buttonFile of buttons) {
        const execFile = require(`../../buttons/${file.name}/${buttonFile}`);
        if (
          "execute" in execFile &&
          "data" in execFile &&
          execFile.data.customId
        ) {
          btns.set(execFile.data.customId, execFile);
        } else {
          client.logs.warn(
            `${file.name}/${buttonFile} is missing "data" or "execute".`,
            "BTNS"
          );
        }
      }
    } else if (file.isFile()) {
      const execFile = require(`../../buttons/${file.name}`);
      if (
        "execute" in execFile &&
        "data" in execFile &&
        execFile.data.customId
      ) {
        btns.set(execFile.data.customId, execFile);
      } else {
        client.logs.warn(
          `${file.name} is missing "data" or "execute".`,
          "BTNS"
        );
      }
    }
  }
};
