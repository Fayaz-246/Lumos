const { Schema, model } = require("mongoose");

let schema = new Schema({
  GuildID: { type: String, required: true },
  UserID: { type: String, required: true },
  afk: {
    type: Object,
    default: {
      isAFK: false,
      timestamp: null,
      reason: null,
    },
  },
  economy: {
    type: Object,
    default: {
      wallet: 0,
      bank: 0,
    },
  },
});

module.exports = model("user9853", schema);
