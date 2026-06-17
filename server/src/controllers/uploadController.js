const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const validateRow = require("../services/validationService");
const processedPath = path.join(__dirname, "../processed");

const createChunks = require("../services/chunkService");

const processCSV = async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      const requiredColumns = [
        "order_id",
        "product_id",
        "payment_mode",
        "phone",
        "country_code",
        "order_date",
      ];

      const uploadedColumns = Object.keys(results[0] || {});

      const missingColumns = requiredColumns.filter(
        (column) => !uploadedColumns.includes(column),
      );

      if (missingColumns.length > 0) {
        return res.status(400).json({
          message: "Invalid CSV Structure",
          missingColumns,
        });
      }

      const validRecords = [];
      const invalidRecords = [];

      results.forEach((row) => {
        const validation = validateRow(row);

        if (validation.isValid) {
          validRecords.push(row);
        } else {
          invalidRecords.push({
            ...row,
            errors: validation.errors,
          });
        }
      });

      const parser = new Parser();

      let validCsv = "";
      let invalidCsv = "";

      try {
        if (validRecords.length > 0) {
          validCsv = parser.parse(validRecords);
        }

        if (invalidRecords.length > 0) {
          invalidCsv = parser.parse(invalidRecords);
        }
      } catch (error) {
        console.error("CSV Generation Error:", error);

        return res.status(500).json({
          message: "Failed to generate CSV files",
        });
      }

      if (!fs.existsSync(processedPath)) {
        fs.mkdirSync(processedPath, { recursive: true });
      }

      if (validRecords.length > 0) {
        fs.writeFileSync(`${processedPath}/valid_records.csv`, validCsv);
      }

      if (invalidRecords.length > 0) {
        fs.writeFileSync(`${processedPath}/error_records.csv`, invalidCsv);
      }
      createChunks(validRecords, 1000);

      res.status(200).json({
        message: "Validation Complete",
        totalRows: results.length,
        validRecords: validRecords.length,
        invalidRecords: invalidRecords.length,
        files: {
          validFile: "valid_records.csv",
          errorFile: "error_records.csv",
        },
      });
    })

    .on("error", (error) => {
      console.error(error);

      return res.status(500).json({
        message: "Error processing CSV file",
      });
    });
};

module.exports = {
  processCSV,
};
