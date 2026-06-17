const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

function createChunks(records, chunkSize = 1000) {
  console.log("Creating chunks...");
  console.log("Total Records:", records.length);

  const chunkDir = path.join(__dirname, "../chunks");

  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, {
      recursive: true,
    });
  }

  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);

    console.log(
      `Creating chunk ${i / chunkSize + 1} with ${chunk.length} records`,
    );

    const parser = new Parser();

    const csv = parser.parse(chunk);

    fs.writeFileSync(`${chunkDir}/chunk_${i / chunkSize + 1}.csv`, csv);
  }

  console.log("Chunking completed");
}

module.exports = createChunks;
