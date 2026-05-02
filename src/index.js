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

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.DOMAIN,
    credentials: true,
}));

// Routes
app.get("/", (req, res) => res.json({ message: "Setup Success" }));
app.use("/api/user", userRouter);
app.use("/api/transaction", TransactionRouter); // ✅ THIS FIXES YOUR ERROR

// DB
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Database connected !"))
    .catch(() => console.log("Database not connected !"));

// Server
app.listen(3030, () => console.log("Server is running on port 3030"));