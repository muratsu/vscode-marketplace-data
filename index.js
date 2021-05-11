const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// Create database instance and start server
(async () => {
  const adapter = new FileSync("vscode-data.json");
  const db = await low(adapter);

  const numberOfExtensions = db.get("extensions").size().value();
  const mostPopularFive = db
    .get("extensions")
    // make sure plugin is public
    .filter((o) => o.flags.includes('public'))
    // make sure plugin has stats (some dont because they're too new)
    .filter((o) => (o.statistics && o.statistics.find(stat => stat.statisticName === 'downloadCount'))) 
    .sortBy((o) => {
      let statistics = o.statistics;
      return statistics.find(stat => stat.statisticName === 'downloadCount').value;
    })
    .reverse() // lodash does asc sort, need to reverse
    .take(5)
    .value()
    .map((o) => `${o.extensionName} (${o.statistics.find(stat => stat.statisticName === 'downloadCount').value})`)
    .join(', ')

  const previewCount = db
  .get("extensions")
  .filter((o) => o.flags.includes('preview'))
  .size()
  .value()

  // Let's print out stats!!
  console.log(`Number of extensions: ${numberOfExtensions}`);
  console.log(`Top 5 Plugins (dl count): ${mostPopularFive}`)
  console.log(`Preview Plugin count: ${previewCount} (${Math.round(previewCount/numberOfExtensions*100)}%)`)

})();
