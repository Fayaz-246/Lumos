const { Schema, model } = require("mongoose");

let schema = new Schema({
  GuildID: { type: String, required: true },
  Roles: {
    type: [Object],
    default: [],
  },
  Embed: {
    type: {
      title: String,
      description: String,
      color: Number,
      timestamp: Boolean,
    },
    required: false,
    default: {
      title: "Get your roles!",
      description: "Click the buttons below to add the roles to your profile!",
      color: 0x00000,
      timestamp: false,
    },
  },
});

module.exports = model("reactionRoles6643", schema);
