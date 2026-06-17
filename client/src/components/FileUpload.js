import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://transaction-validator-8ywo.onrender.com";

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

      const response = await axios.post(`${API_BASE_URL}/upload`, formData);

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

          <p className="text-muted">
            Supported Date Formats: YYYY-MM-DD, YYYY-MM-DD HH:mm:ss,
            DD-MM-YYYY, DD-MM-YYYY HH:mm:ss, MM/DD/YYYY, MM/DD/YYYY HH:mm:ss
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
                  href={`${API_BASE_URL}/download/valid`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-success me-2">
                    Download Cleaned CSV
                  </button>
                </a>

                <a
                  href={`${API_BASE_URL}/download/error`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-danger">Download Error CSV</button>
                </a>
              </div>

              {result.chunks?.length > 0 && (
                <div className="mt-4">
                  <h3>CSV Chunks</h3>
                  <p className="text-muted">
                    Generated {result.chunks.length} chunk file(s) from valid
                    records.
                  </p>

                  <a
                    href={`${API_BASE_URL}/download/chunks/zip`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="btn btn-secondary mb-3">
                      Download All Chunks
                    </button>
                  </a>

                  <div>
                    {result.chunks.map((chunk) => (
                      <a
                        key={chunk.filename}
                        href={`${API_BASE_URL}/download/chunks/${chunk.filename}`}
                        target="_blank"
                        rel="noreferrer"
                        className="me-2 d-inline-block mb-2"
                      >
                        <button className="btn btn-outline-secondary">
                          {chunk.filename} ({chunk.records} rows)
                        </button>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
