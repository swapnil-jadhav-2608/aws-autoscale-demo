const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const os = require("os");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure AWS SDK (EC2 instances already have IAM role, so no keys needed)
AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "UserMessages";

// Home route
app.get("/", (req, res) => {
  res.send(`Hello from EC2 instance: ${os.hostname()}`);
});

// Fetch all messages
app.get("/api/messages", async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();
    res.json(data.Items);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new message
app.post("/api/messages", async (req, res) => {
  const { username, message } = req.body;

  if (!username || !message)
    return res.status(400).json({ error: "Username and message required" });

  const item = {
    id: Date.now().toString(),
    username,
    message,
    createdAt: new Date().toISOString(),
  };

  try {
    await dynamoDB
      .put({ TableName: TABLE_NAME, Item: item })
      .promise();
    res.json({ success: true, item });
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ error: "Failed to add message" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
