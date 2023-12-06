const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.modules = [];
  const moduleFiles = fs
    .readdirSync(path.join(__dirname, "..", "commands", "modules"))
    .filter((f) => f.endsWith(".js"));
  for (const file of moduleFiles) {
    const name = file.split(".")[0];
    client.modules.push({
      name: `${name}`,
      file: require(`../schemas/${name}`),
    });
  }
};
