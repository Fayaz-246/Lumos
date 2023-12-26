const economy = require("../../schemas/economy");

module.exports = async () => {
  setInterval(async () => {
    const cds = await economy
      .find()
      .select("lastBegged lastWorked lastDaily lastRobbed");
    for (const cd of cds) {
      if (cd.lastBegged) {
        if (Date.now() < cd.lastBegged) return;
        cds.lastBegged = 0;
        await cd.save();
      }
      if (cd.lastRobbed) {
        if (Date.now() < cd.lastRobbed) return;
        cds.lastRobbed = 0;
        await cd.save();
      }
      if (cd.lastWorked) {
        if (Date.now() < cd.lastWorked) return;
        cds.lastWorked = 0;
        await cd.save();
      }
      if (cd.lastDaily) {
        if (Date.now() < cd.lastDaily) return;
        cds.lastDaily = 0;
        await cd.save();
      }
    }
  }, 300_000);
};
