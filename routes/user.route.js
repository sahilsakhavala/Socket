import { Router } from "express";
const router = Router();
import { getProfile, signIn, signUp, updateProfle } from "../controllers/userController.js";
import userAuth from "../middleware/auth.js";

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-profile", userAuth, getProfile);
router.patch("/update-profile", userAuth, updateProfle);

export default router