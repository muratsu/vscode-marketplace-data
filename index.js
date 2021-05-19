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
    .filter((o) => (o.statistics && o.statistics.find(stat => stat.statisticName === 'install'))) 
    .sortBy((o) => {
      let statistics = o.statistics;
      return statistics.find(stat => stat.statisticName === 'install').value;
    })
    .reverse() // lodash does asc sort, need to reverse
    .take(100)
    .value()
    .map((o) => {
      const name = o.extensionName;
      const installCount = o.statistics.find(stat => stat.statisticName === 'install').value;
      const publisherName = o.publisher.publisherName;
      const githubLinkObj = o.versions[0].properties.find(o => o.key === "Microsoft.VisualStudio.Services.Links.GitHub");
      const githubLink = githubLinkObj ? githubLinkObj.value : "";
      const categories = o.categories.join(', ');
      const tags = o.tags.join(', ')

      return `${name}\t${installCount}\t${publisherName}\t${githubLink}\t${categories}\t${tags}`;
    })
    .join('\n')

  const previewCount = db
  .get("extensions")
  .filter((o) => o.flags.includes('preview'))
  .size()
  .value()

  // Let's print out stats!!
  // console.log(`Number of extensions: ${numberOfExtensions}`);
  console.log(`\n${mostPopularFive}`)
  // console.log(`Preview Plugin count: ${previewCount} (${Math.round(previewCount/numberOfExtensions*100)}%)`)

  // Unique Authors for top 100
  // console.log(db
  //   .get("extensions")
  //   // make sure plugin is public
  //   .filter((o) => o.flags.includes('public'))
  //   // make sure plugin has stats (some dont because they're too new)
  //   .filter((o) => (o.statistics && o.statistics.find(stat => stat.statisticName === 'install'))) 
  //   .sortBy((o) => {
  //     let statistics = o.statistics;
  //     return statistics.find(stat => stat.statisticName === 'install').value;
  //   })
  //   .reverse() // lodash does asc sort, need to reverse
  //   .take(25)
  //   .map((o) => o.publisher.displayName)
  //   .uniq()
  //   .size()
  //   .value()
  //   )
})();

// Typical Interface
// {
//   "publisher": {
//     "publisherId": "f4bd11eb-715e-4578-84e0-e765d9b14a78",
//     "publisherName": "gmlewis-vscode",
//     "displayName": "gmlewis-vscode",
//     "flags": "verified"
//   },
//   "extensionId": "ac7e67c6-d7b6-4b8d-8279-31f6a13b9641",
//   "extensionName": "flutter-stylizer",
//   "displayName": "flutter-stylizer",
//   "flags": "validated, public",
//   "lastUpdated": "2021-04-29T16:51:04.52Z",
//   "publishedDate": "2018-11-10T17:21:10.813Z",
//   "releaseDate": "2018-11-10T17:21:10.813Z",
//   "shortDescription": "Flutter Stylizer organizes your Flutter classes in an opinionated and consistent manner.",
//   "versions": [
//     {
//       "version": "0.1.1",
//       "flags": "validated",
//       "lastUpdated": "2021-04-29T16:51:04.517Z",
//       "files": [],
//       "properties": [
//         {
//           "key": "Microsoft.VisualStudio.Services.Links.Getstarted",
//           "value": "https://github.com/gmlewis/flutter-stylizer"
//         },
//         {
//           "key": "Microsoft.VisualStudio.Services.Links.Source",
//           "value": "https://github.com/gmlewis/flutter-stylizer"
//         },
//         {
//           "key": "Microsoft.VisualStudio.Services.Links.GitHub",
//           "value": "https://github.com/gmlewis/flutter-stylizer"
//         },
//         {
//           "key": "Microsoft.VisualStudio.Code.Engine",
//           "value": "^1.43.0"
//         },
//         {
//           "key": "Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown",
//           "value": "true"
//         },
//         {
//           "key": "Microsoft.VisualStudio.Code.ExtensionDependencies",
//           "value": ""
//         },
//         {
//           "key": "Microsoft.VisualStudio.Code.ExtensionPack",
//           "value": ""
//         },
//         {
//           "key": "Microsoft.VisualStudio.Code.LocalizedLanguages",
//           "value": ""
//         },
//         {
//           "key": "Microsoft.VisualStudio.Code.ExtensionKind",
//           "value": "workspace"
//         }
//       ],
//       "assetUri": "https://gmlewis-vscode.gallerycdn.vsassets.io/extensions/gmlewis-vscode/flutter-stylizer/0.1.1/1619714926972",
//       "fallbackAssetUri": "https://gmlewis-vscode.gallery.vsassets.io/_apis/public/gallery/publisher/gmlewis-vscode/extension/flutter-stylizer/0.1.1/assetbyname"
//     }
//   ],
//   "categories": [
//     "Other"
//   ],
//   "tags": [
//     "dart"
//   ],
//   "statistics": [
//     {
//       "statisticName": "install",
//       "value": 62681
//     },
//     {
//       "statisticName": "averagerating",
//       "value": 4.75
//     },
//     {
//       "statisticName": "ratingcount",
//       "value": 4
//     },
//     {
//       "statisticName": "trendingdaily",
//       "value": 0.0031912177687005365
//     },
//     {
//       "statisticName": "trendingmonthly",
//       "value": 3.981044166453919
//     },
//     {
//       "statisticName": "trendingweekly",
//       "value": 0.8696068419708961
//     },
//     {
//       "statisticName": "updateCount",
//       "value": 74671
//     },
//     {
//       "statisticName": "weightedRating",
//       "value": 4.502289092363766
//     },
//     {
//       "statisticName": "downloadCount",
//       "value": 139
//     }
//   ],
//   "installationTargets": [
//     {
//       "target": "Microsoft.VisualStudio.Code",
//       "targetVersion": ""
//     }
//   ],
//   "deploymentType": 0
// }