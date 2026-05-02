import { sendMail } from "../utils/sendMail.js";
import UserModel from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ====================== CREATE TOKEN ======================
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role || "user",
    },
    process.env.AUTH_SECRET,
    { expiresIn: "1d" }
  );
};

// ====================== GENERATE OTP ======================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// ====================== SIGNUP ======================
export const createUser = async (req, res) => {
  try {
    console.log("🔥 SIGNUP HIT", req.body);

    let { fullname, email, password, mobile } = req.body;

    if (!fullname || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
