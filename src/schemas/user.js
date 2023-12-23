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
  birthday: { type: Number },
});

module.exports = model("user9853", schema);
