import TransactionModel from "./transaction.model.js";

// ================= CREATE TRANSACTION =================
export const createTransaction = async (req, res) => {
  try {
    const {
      transactionType,
      title,
      amount,
      paymentMethod,
      notes,
      date,
    } = req.body;

    if (
      !transactionType ||
      !title ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message: "All required fields must be filled.",
      });
    }

    const newTransaction = await TransactionModel.create({
      userId: req.user.id,
      transactionType,
      title,
      amount,
      paymentMethod,
      notes,
      date,
    });

    res.status(201).json({
      message: "Transaction created successfully.",
      data: newTransaction,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error.",
    });
  }
};

// ================= UPDATE TRANSACTION =================
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction =
      await TransactionModel.findById(id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (
      transaction.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized access.",
      });
    }

    const updatedTransaction =
      await TransactionModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.json({
      message: "Transaction updated successfully.",
      data: updatedTransaction,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error.",
    });
  }
};

// ================= DELETE TRANSACTION =================
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction =
      await TransactionModel.findById(id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (
      transaction.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized access.",
      });
    }

    await TransactionModel.findByIdAndDelete(id);

    res.json({
      message: "Transaction deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error.",
    });
  }
};

// ================= GET ALL TRANSACTIONS =================
export const getTransaction = async (req, res) => {
  try {
    const transactions =
      await TransactionModel.find({
        userId: req.user.id,
      }).sort({ createdAt: -1 });

    res.json({
      message: "Transactions fetched successfully.",
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error.",
    });
  }
};

// ================= GET SINGLE TRANSACTION =================
export const getSingleTransaction = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const transaction =
      await TransactionModel.findById(id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (
      transaction.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized access.",
      });
    }

    res.json({
      message: "Transaction fetched successfully.",
      data: transaction,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error.",
    });
  }
};