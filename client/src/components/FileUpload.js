import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "https://transaction-validator-8ywo.onrender.com/upload",
        formData,
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);

      if (error.response) {
        if (error.response?.data?.missingColumns) {
          alert(
            `Missing Columns: ${error.response.data.missingColumns.join(", ")}`,
          );
        } else {
          alert(error.response?.data?.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <div style={{ padding: "30px" }}>
          <h1 className="text-center mb-4">Transaction Validator Platform</h1>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br />
          <br />

          <button className="btn btn-primary" onClick={handleUpload}>
            Upload CSV
          </button>

          <p className="text-muted mt-3">
            Supported Columns: order_id, product_id, payment_mode, phone,
            country_code, order_date
          </p>

          {loading && <p>Uploading...</p>}

          {result && (
            <div>
              <p>Invalid Records: {result.invalidRecords}</p>
              <div className="mt-4">
                <h3>Validation Summary</h3>

                <div className="alert alert-info">
                  Total Rows: {result.totalRows}
                </div>

                <div className="alert alert-success">
                  Valid Records: {result.validRecords}
                </div>

                <div className="alert alert-danger">
                  Invalid Records: {result.invalidRecords}
                </div>
              </div>
              <br />
              <div className="mt-3">
                <a
                  href="http://localhost:5000/download/valid"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-success me-2">
                    Download Cleaned CSV
                  </button>
                </a>

                <a
                  href="http://localhost:5000/download/error"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-danger">Download Error CSV</button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
