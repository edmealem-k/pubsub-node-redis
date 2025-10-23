import express from "express";
import { createClient } from "redis";

const app = express();
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6380";
console.log("Using REDIS_URL =", redisUrl);

const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("ready", () => console.log("Redis client ready"));

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Health Check OK");
});

interface submissionData {
  id: string;
  problemId: string;
  code: string;
  userId: string;
  language: string;
  timestamp: string;
}

app.post("/submit", async (req, res) => {
  try {
    const { problemId, code, userId, language } = req.body;
    if (!problemId || !code || !userId || !language) {
      return res.status(400).send("Missing required fields");
    }

    const submissionId = `submission:${Date.now()}:${userId}`;
    const submissionData: submissionData = {
      id: submissionId,
      problemId,
      code,
      userId,
      language,
      timestamp: new Date().toISOString(),
    };

    await redisClient.lPush("submissions", JSON.stringify(submissionData));

    res.status(200).json({ message: "Submission received", submissionId });
  } catch (error) {
    console.error("Error processing submission:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;

async function initializeApp() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Error starting server:", err);
    process.exit(1);
  }
}

initializeApp();
