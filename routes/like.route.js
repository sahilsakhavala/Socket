import { Router } from "express";
const router = Router();
import { getLikes, likePost } from "../controllers/likeController.js";

router.post("/post", likePost);
router.get("/get", getLikes);

export default router