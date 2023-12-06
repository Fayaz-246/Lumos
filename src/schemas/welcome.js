const { Schema, model } = require("mongoose");

let schema = new Schema({
  GuildID: {
    type: String,
    required: true,
  },
  ChannelID: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
});

module.exports = model("welcomes9138", schema);
