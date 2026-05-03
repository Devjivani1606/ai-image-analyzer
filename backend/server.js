const express = require("express");
const cors = require("cors");
const path = require("path");

const uploadRoute = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

// serve audio files
app.use(express.static(path.join(__dirname)));

app.use("/upload", uploadRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});