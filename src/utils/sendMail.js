import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (email, subject, template) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ✅ simpler
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html: template,
    });

    console.log("✅ Email sent to", email);
    return true;

  } catch (err) {
    console.error("❌ Email failed:", err.message);
    return false;
  }
};
