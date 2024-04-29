import { Router } from "express";
const router = Router();
import user from "../routes/user.route.js";
import post from "../routes/post.route.js";
import like from "../routes/like.route.js";
import userAuth from "../middleware/auth.js";
import comment from "../routes/comment.route.js";
import chat from "../routes/chat.route.js";

router.use("/", user);
router.use("/post", userAuth, post);
router.use("/like", userAuth, like);
router.use("/comment", userAuth, comment);
router.use("/", userAuth, chat);

export default router