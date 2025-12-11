import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMe, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/update", protect, updateUser);

export default router;
