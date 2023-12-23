const AsciiTable = require("ascii-table");
const { readdirSync } = require("fs");
const formatStr = require("../../utils/formatStr");

module.exports = (client) => {
  const table = new AsciiTable()
    .setTitle("MENUS")
    .setHeading("Name", "Type", "Status");

  const menuFolders = readdirSync("./src/menus");
  for (const menuType of menuFolders) {
    const typeFolders = readdirSync(`./src/menus/${menuType}`).filter((f) =>
      f.endsWith(".js")
    );

    for (let typeFiles of typeFolders) {
      typeFiles = require(`../../menus/${menuType}/${typeFiles}`);
      if (!typeFiles.data.customId || !typeFiles.execute) {
        client.logs.warn(
          `${typeFiles} is missing "data" or "execute".`,
          "MENU"
        );
        return table.addRow(typeFiles, formatStr(menuType), "❌");
      }
      switch (menuType) {
        case "string":
          client.menus.string.set(typeFiles.data.customId, typeFiles);
          table.addRow(typeFiles.data.customId, formatStr(menuType), "✅");
          break;

        case "role":
          client.menus.role.set(typeFiles.data.customId, typeFiles);
          table.addRow(typeFiles.data.customId, formatStr(menuType), "✅");
          break;
      }
    }
    client.tables.menus = table;
  }
};
