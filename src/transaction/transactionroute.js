import { Router } from "express";
import {
    createTransaction,
    deleteTransaction,
    getTransaction,
    updateTransaction
} from "./transaction.controller.js";

import { verifyTokenGuard } from "../middleware/auth.middleware.js";

const TransactionRouter = Router();

// 🔒 PROTECTED ROUTES

TransactionRouter.post("/create", verifyTokenGuard, createTransaction);

TransactionRouter.put("/update/:id", verifyTokenGuard, updateTransaction);

TransactionRouter.delete("/delete/:id", verifyTokenGuard, deleteTransaction);

TransactionRouter.get("/get", verifyTokenGuard, getTransaction);

export default TransactionRouter;