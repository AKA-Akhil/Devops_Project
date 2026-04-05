import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pathToFileURL } from "node:url";
import { analyzeRepository } from "./repoAnalyzer.js";

dotenv.config();

export const app = express();
const port = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Devops project server" });
});

app.post("/api/analyze", async (req, res) => {
  const { repoUrl } = req.body || {};

  if (!repoUrl) {
    return res.status(400).send("repoUrl is required.");
  }

  try {
    const report = await analyzeRepository(repoUrl);
    return res.json(report);
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Analysis failed";
    return res.status(500).send(message);
  }
});

export function startServer() {
  return app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
