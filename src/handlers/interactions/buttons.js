const AsciiTable = require("ascii-table");
const { readdirSync } = require("fs");
const formatStr = require("../../utils/formatStr");

module.exports = (client) => {
  const { buttons: btns } = client;
  const table = new AsciiTable()
    .setTitle("BUTTONS")
    .setHeading("Name", "Folder", "Status");
  const buttonFiles = readdirSync(`./src/buttons`, { withFileTypes: true });

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
          table.addRow(execFile.data.customId, formatStr(file.name), "✅");
        } else {
          client.logs.warn(
            `${file.name}/${buttonFile} is missing "data" or "execute".`,
            "BTNS"
          );
          table.addRow(buttonFile, formatStr(file.name), "❌");
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
        table.addRow(execFile.data.customId, formatStr(file.name), "✅");
      } else {
        client.logs.warn(
          `${file.name} is missing "data" or "execute".`,
          "BTNS"
        );
        table.addRow(file.name, formatStr(file.name), "❌");
      }
    }

    client.tables.buttons = table;
  }
};
