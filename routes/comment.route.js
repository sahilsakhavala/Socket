import { Router } from "express";
const router = Router();
import { addComment, deleteComment, getComments } from "../controllers/commentController.js";

router.post("/add", addComment);
router.get("/get", getComments);
router.delete("/delete", deleteComment);

export default router