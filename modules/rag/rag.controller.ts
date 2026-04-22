import { ragService } from "./rag.service";
import { Request, Response } from "express";

class RagController {
  async addKnowledge(req: Request, res: Response) {
    try {
      const { text, metadata } = req.body;

      if (!text || typeof text != ") {
        return res.status(400).json({
          error: "Missing or invalid 'text' field. Please provide a string.",
        });
      }

      const result = await ragService.addKnowledge(text, metadata);

      res.json({
        success: true,
        message: `Successfully added knowledge`,
        chunksAdded: result.chunksAdded,
      });
    } catch (error: any) {
      console.error("Error adding knowledge:", error);
      res.status(500).json({
        error: "Failed to add knowledge",
        details: error.message,
      });
    }
  }

  async askQuestion(req: Request, res: Response) {
    try {
      const { question, topK } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({
          error: "Missing or invalid 'question' field. Please provide a string.",
        });
      }

      const result = await ragService.askQuestion(question, topK);

      res.json({
        success: true,
        answer: result.answer,
        sources: result.sources,
      });
    } catch (error: any) {
      console.error("Error asking question:", error);
      res.status(500).json({
        error: "Failed to process question",
        details: error.message,
      });
    }
  }

  async clearKnowledge(_: Request, res: Response) {
    ragService.clearKnowledge();
    res.json({
      success: true,
      message: "All knowledge has been cleared",
    });
  }
}

export const ragController = new RagController();
