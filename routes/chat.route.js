import { Router } from "express";
const router = Router();
import { getLatestChatMessages, getMessages } from "../controllers/chatController.js";

router.get("/get-message", getMessages);
router.get("/get-latest-message", getLatestChatMessages);

export default router