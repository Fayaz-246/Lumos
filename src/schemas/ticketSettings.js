const { Schema, model } = require("mongoose");

let ticketSettings = new Schema({
  GuildID: {
    type: String,
    required: true,
  },
  CategoryID: {
    type: String,
    required: true,
  },
  TranscriptsID: {
    type: String,
    required: true,
  },
  ManagerRole: {
    type: String,
    required: true,
  },
  Embed: {
    type: Schema({ title: String, description: String, color: Number }),
    required: false,
    default: {
      title: "Open a ticket!",
      description: "Open a ticket with the button below.",
      color: 0x00000,
    },
  },
  Button: {
    type: Schema({
      type: Number,
      emoji: Schema({ id: String, name: String, animated: Boolean }),
      style: Number,
      label: String,
    }),
    required: false,
    default: {
      type: 2,
      emoji: { id: undefined, name: "🎟️", animated: false },
      custom_id: "tickets",
      style: 1,
      label: "Open a ticket!",
    },
  },
});

module.exports = model("ticketSettings8972", ticketSettings);
