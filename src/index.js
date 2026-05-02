import express from "express";
import userRouter from "./user/user.routes.js";
import TransactionRouter from "./transaction/transactionroute.js";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS (IMPORTANT)
app.use(
  cors({
    origin: process.env.DOMAIN || "*",
    credentials: true,
  })
);

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

app.use("/api/user", userRouter);
app.use("/api/transaction", TransactionRouter);

// ✅ MongoDB connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Server (VERY IMPORTANT FIX)
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
