require("colors");
const mongo = require("mongoose");
const timestamp = require("../../utils/timestamp");

module.exports = (client) => {
  const uri = process.env.MongoURI;
  if (!uri) return client.logs.warn("Aborting DB connection. (NO URI)");
  mongo.connect(uri);

  const { connection } = mongo;

  connection.on("connected", () => {
    client.logs.info("Connected to DB!");
  });

  connection.on("disconnected", () => {
    client.logs.info("Disconnected from DB.");
  });

  connection.on("err", (err) => {
    client.logs.error(`DB ERR: \n${err}`, "[DB ERR]");
  });
};
