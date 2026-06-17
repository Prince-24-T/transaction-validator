const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

const app = express();

app.use(
  cors({
    origin: "https://transaction-validator-vsxy.vercel.app",
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
