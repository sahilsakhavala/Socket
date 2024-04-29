import { Router } from "express";
const router = Router();
import { createPost, deletePost, getPost } from "../controllers/postController.js";

router.post("/create", createPost);
router.get("/get", getPost);
router.delete("/delete", deletePost);

export default router