import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect, adminOnly , doctorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// kiểm tra role
router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

router.get("/user", protect, (req, res) => {
  res.json({ message: "Welcome User!" });
});
router.get("/doctor", protect, doctorOnly, (req, res) => {
  res.json({ message: "Welcome Doctor!" });
});

export default router;
