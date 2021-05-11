const axios = require("axios");
const fs = require("fs");

// Currently there are 26502 extensions

const data = {
  extensions: [],
  resultMetadata: [],
};

(async () => {
  for (let x = 1; x <= 27; x++) {
    try {
      const res = await axios.post(
        "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
        {
          assetTypes: [
            "Microsoft.VisualStudio.Services.Icons.Default",
            "Microsoft.VisualStudio.Services.Icons.Branding",
            "Microsoft.VisualStudio.Services.Icons.Small",
          ],
          filters: [
            {
              criteria: [
                { filterType: 8, value: "Microsoft.VisualStudio.Code" },
                {
                  filterType: 10,
                  value: 'target:"Microsoft.VisualStudio.Code" ',
                },
                { filterType: 12, value: "37888" },
              ],
              direction: 2,
              pageSize: 1000,
              pageNumber: x,
              sortBy: 10,
              sortOrder: 0,
              pagingToken: null,
            },
          ],
          flags: 870,
        },
        {
          headers: {
            accept:
              "application/json;api-version=6.1-preview.1;excludeUrls=true",
          },
        }
      );

      data.extensions = [...data.extensions, ...res.data.results[0].extensions];
      if (x === 1) {
        data.resultMetadata = [...res.data.results[0].resultMetadata];
      }
    } catch (err) {
      console.error(err);
    }
  }

  fs.writeFileSync("vscode-data.json", JSON.stringify(data, null, 2), {
    encoding: "utf8",
    flag: "w",
  });
})();
