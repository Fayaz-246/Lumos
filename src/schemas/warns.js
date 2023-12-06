const { Schema, model } = require("mongoose");

let schema = new Schema({
  GuildID: { type: String, required: true },
  UserID: { type: String, required: true },
  List: { type: Array, required: true },
});

module.exports = model("warns1284", schema);
