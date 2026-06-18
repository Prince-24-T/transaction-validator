const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

const app = express();

const allowedOrigins = [
  "https://transaction-validator-vsxy.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
].map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/download", downloadRoutes);

app.get("/", (req, res) => {
  res.send("Transaction Validator API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
