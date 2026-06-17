const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const chunkDir = path.join(__dirname, "../chunks");

function clearOldChunks() {
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, {
      recursive: true,
    });

    return;
  }

  fs.readdirSync(chunkDir).forEach((file) => {
    if (file.startsWith("chunk_") && file.endsWith(".csv")) {
      fs.unlinkSync(path.join(chunkDir, file));
    }
  });
}

function createChunks(records, chunkSize = 1000) {
  console.log("Creating chunks...");
  console.log("Total Records:", records.length);

  clearOldChunks();
  const chunks = [];

  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    const filename = `chunk_${i / chunkSize + 1}.csv`;

    console.log(
      `Creating chunk ${i / chunkSize + 1} with ${chunk.length} records`,
    );

    const parser = new Parser();

    const csv = parser.parse(chunk);

    fs.writeFileSync(path.join(chunkDir, filename), csv);

    chunks.push({
      filename,
      records: chunk.length,
    });
  }

  console.log("Chunking completed");

  return chunks;
}

module.exports = createChunks;
