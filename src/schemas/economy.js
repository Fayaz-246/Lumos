const { Schema, model } = require("mongoose");

let schema = new Schema({
  GuildID: { type: String, required: true },
  UserID: { type: String, required: true },
  wallet: { type: Number, required: false, default: 0 },
  bank: { type: Number, required: false, default: 0 },
  lastWorked: { type: Number },
  lastDaily: { type: Number },
  lastBegged: { type: Number },
});

module.exports = model("economy4322", schema);
