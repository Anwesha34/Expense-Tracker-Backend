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

// ================= MIDDLEWARE =================
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= CORS FIX (FINAL) =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://expense-tracker-frontend-dun-mu.vercel.app",
  "https://expense-tracker-frontend-git-main-anwesha34s-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// 🔥 VERY IMPORTANT (fix preflight issue)
app.options("*", cors());

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

app.use("/api/user", userRouter);
app.use("/api/transaction", TransactionRouter);

// ================= DB CONNECTION =================
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
