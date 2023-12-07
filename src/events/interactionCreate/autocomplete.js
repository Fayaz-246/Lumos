const { Client, Interaction } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async ({ commands, logs }, interaction) => {
  if (!interaction.isAutocomplete()) return;
  const command = commands.get(interaction.commandName);
  if (!command)
    logs.error(
      `No matching autocomplete command for - ${interaction.commandName}`
    );
  try {
    command.autocomplete(interaction);
  } catch (e) {
    logs.error(e);
  }
};
