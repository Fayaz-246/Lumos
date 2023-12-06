const { Schema, model } = require("mongoose");

let schema = new Schema({
  GuildID: { type: String, required: true },
});

module.exports = model("ghostping1432", schema);
