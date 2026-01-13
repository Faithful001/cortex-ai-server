import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ragService } from "./modules/rag/rag.service";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasKnowledge: ragService.hasKnowledge(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧠 Cortex AI Server running on http://localhost:${PORT}`);
  console.log(`
Available endpoints:
  POST /knowledge  - Add business knowledge (body: { text: string })
  POST /ask        - Ask a question (body: { question: string })
  DELETE /knowledge - Clear all knowledge
  GET /health      - Health check
  `);
});
