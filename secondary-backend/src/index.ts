import express from "express";
import { createClient } from "redis";

const app = express();
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6380";
console.log("Using REDIS_URL =", redisUrl);

const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("ready", () => console.log("Redis client ready"));

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

async function processSubmission(submission: string) {
  try {
    const data = JSON.parse(submission) as submissionData;
    console.log("\n\nProcessing submission: ", data.id);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Simulate processing time

    console.log(`\nSubmission ${data.id} processed successfully.\n`);
    console.log("Submission Data:", data);
    console.log("--------------------------------------------------");
    await new Promise((resolve) => setTimeout(resolve, 3000));
  } catch (err) {
    console.error("Error processing submission:", err);
  }
}

const PORT = process.env.PORT || 3001;

async function startWorker() {
  while (true) {
    try {
      const submission = (await redisClient.brPop("submissions", 0)) as {
        key: string;
        element: string;
      } | null; // Blocking pop

      if (submission) {
        await processSubmission(submission.element);
      }
    } catch (err) {
      console.error("Error retrieving submission from queue:", err);
      // Implement your error handling logic here. For example, you might want to push
      // the submission back onto the queue or log the error to a file.
    }
  }
}

async function initializeApp() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(`Worker is running on port ${PORT}`);
    });

    startWorker();
  } catch (err) {
    console.log("Error starting server:", err);
    process.exit(1);
  }
}
initializeApp();
