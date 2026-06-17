const express = require("express");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const router = express.Router();
const processedPath = path.join(__dirname, "../processed");
const chunkPath = path.join(__dirname, "../chunks");

router.get("/valid", (req, res) => {
  const filePath = path.join(processedPath, "valid_records.csv");

  res.download(filePath);
});

router.get("/error", (req, res) => {
  const filePath = path.join(processedPath, "error_records.csv");

  res.download(filePath);
});

router.get("/chunks", (req, res) => {
  if (!fs.existsSync(chunkPath)) {
    return res.json({ chunks: [] });
  }

  const chunks = fs
    .readdirSync(chunkPath)
    .filter((file) => file.startsWith("chunk_") && file.endsWith(".csv"))
    .sort((a, b) => {
      const first = Number(a.replace("chunk_", "").replace(".csv", ""));
      const second = Number(b.replace("chunk_", "").replace(".csv", ""));

      return first - second;
    });

  res.json({ chunks });
});

router.get("/chunks/zip", (req, res) => {
  if (!fs.existsSync(chunkPath)) {
    return res.status(404).json({ message: "No chunks available" });
  }

  const chunks = fs
    .readdirSync(chunkPath)
    .filter((file) => file.startsWith("chunk_") && file.endsWith(".csv"));

  if (chunks.length === 0) {
    return res.status(404).json({ message: "No chunks available" });
  }

  const zip = new AdmZip();

  chunks.forEach((file) => {
    zip.addLocalFile(path.join(chunkPath, file));
  });

  const zipBuffer = zip.toBuffer();

  res.set("Content-Type", "application/zip");
  res.set("Content-Disposition", "attachment; filename=chunks.zip");
  res.send(zipBuffer);
});

router.get("/chunks/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);

  if (!filename.startsWith("chunk_") || !filename.endsWith(".csv")) {
    return res.status(400).json({ message: "Invalid chunk filename" });
  }

  const filePath = path.join(chunkPath, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Chunk file not found" });
  }

  res.download(filePath);
});

module.exports = router;
