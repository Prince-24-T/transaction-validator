const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/valid", (req, res) => {
  const filePath = path.join(__dirname, "../processed/valid_records.csv");

  res.download(filePath);
});

router.get("/error", (req, res) => {
  const filePath = path.join(__dirname, "../processed/error_records.csv");

  res.download(filePath);
});

module.exports = router;
