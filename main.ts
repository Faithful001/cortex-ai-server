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
    hasKnowledge: ragService.hasKnowledge() 
  });
});

// Add knowledge to the system
app.post("/knowledge", async (req: Request, res: Response) => {
  try {
    const { text, metadata } = req.body;

    if (!text || typeof text !== "string") {
      res.status(400).json({ 
        error: "Missing or invalid 'text' field. Please provide a string." 
      });
      return;
    }

    const result = await ragService.addKnowledge(text, metadata);
    
    res.json({
      success: true,
      message: `Successfully added knowledge`,
      chunksAdded: result.chunksAdded
    });
  } catch (error: any) {
    console.error("Error adding knowledge:", error);
    res.status(500).json({ 
      error: "Failed to add knowledge", 
      details: error.message 
    });
  }
});

// Ask a question
app.post("/ask", async (req: Request, res: Response) => {
  try {
    const { question, topK } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({ 
        error: "Missing or invalid 'question' field. Please provide a string." 
      });
      return;
    }

    const result = await ragService.askQuestion(question, topK);
    
    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources
    });
  } catch (error: any) {
    console.error("Error asking question:", error);
    res.status(500).json({ 
      error: "Failed to process question", 
      details: error.message 
    });
  }
});

// Clear all knowledge
app.delete("/knowledge", (req: Request, res: Response) => {
  ragService.clearKnowledge();
  res.json({ 
    success: true, 
    message: "All knowledge has been cleared" 
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
