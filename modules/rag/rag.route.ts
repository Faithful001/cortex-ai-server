import express from "express";
import { ragController } from "./rag.controller";

const router = express.Router();

router.post("/knowledge", ragController.addKnowledge);

router.post("/ask", ragController.askQuestion);

router.delete("/knowledge", ragController.clearKnowledge);

export default router;
