const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Index route that receives a token and returns its hash
app.get("/", (req, res) => {
  const PRE_SHARED_KEY = process.env.PRE_SHARED_KEY;
  const token = req.query.token;

  console.log("token", token);

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const hash = generateSolveHash(token);
  const commandBuffer = buildSolveCommandBuffer(hash);

  console.log(commandBuffer);

  res.json({ command: commandBuffer });
});

function generateSolveHash(token) {
  return crypto.createHmac("sha256", PRE_SHARED_KEY).update(token).digest(); // Return buffer for base64 encoding
}

function buildSolveCommandBuffer(hashBuffer) {
  const base64Hash = hashBuffer.toString("base64");
  const command = `#solved ${base64Hash}\r\n`;
  return command;
}

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
