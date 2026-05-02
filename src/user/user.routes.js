import { Router } from "express";
import {
  createUser,
  login,
  forgotPassword,
  getAllUsers,
  toggleUserStatus   // ✅ ADD THIS
} from "./user.controller.js";

import {
  verifyTokenGuard,
  AdminUserGuard
} from "../middleware/auth.middleware.js";

const userRouter = Router();

// ================= SIGNUP =================
userRouter.post("/signup", createUser);

// ================= LOGIN =================
userRouter.post("/login", login);

// ================= FORGOT PASSWORD =================
userRouter.post("/forgot-password", forgotPassword);

// ================= SESSION =================
userRouter.get(
  "/session",
  verifyTokenGuard,
  (req, res) => {
    return res.json({ user: req.user });
  }
);

// ================= ADMIN: GET ALL USERS =================
userRouter.get(
  "/all-users",
  verifyTokenGuard,
  getAllUsers
);

// ================= TOGGLE STATUS =================
userRouter.patch(
  "/toggle-status/:id",
  verifyTokenGuard,     // ✅ protect route
  toggleUserStatus
);

export default userRouter;