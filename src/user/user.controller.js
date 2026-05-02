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
    }

    email = email.toLowerCase().trim();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
      mobile,
      role: "user",
      status: "active",
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    await sendMail(
      email,
      "OTP Verification",
      `<h2>Your OTP is: ${otp}</h2>`
    );

    return res.status(201).json({
      message: "Signup successful, OTP sent",
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    console.log("🔥 LOGIN HIT", req.body);

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    email = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ BLOCK INACTIVE USERS
    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account is deactivated by admin",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login success",
      token,
      role: user.role || "user",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ====================== FORGOT PASSWORD ======================
export const forgotPassword = async (req, res) => {
  try {
    console.log("🔥 FORGOT PASSWORD HIT", req.body);

    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    email = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // ✅ BLOCK INACTIVE USERS
    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account is deactivated by admin",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendMail(
      email,
      "Password Reset OTP",
      `<h2>Your OTP is: ${otp}</h2>`
    );

    return res.status(200).json({
      message: "OTP sent to email 📧",
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ====================== GET ALL USERS ======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-password -otp -otpExpiry -__v");

    return res.status(200).json(users);

  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ====================== TOGGLE USER STATUS ======================
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Prevent admin deactivation
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Cannot deactivate admin",
      });
    }

    user.status =
      user.status === "active" ? "inactive" : "active";

    await user.save();

    return res.status(200).json({
      message: "Status updated successfully",
      status: user.status,
    });

  } catch (err) {
    console.error("Toggle status error:", err);
    return res.status(500).json({ message: err.message });
  }
};
