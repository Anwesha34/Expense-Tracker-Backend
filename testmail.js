import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendTestEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD, // App Password
      },
    });

    // Verify connection first
    await transporter.verify();
    console.log("✅ SMTP Connection successful");

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL, // send to yourself to test
      subject: "Test Email ✔",
      html: "<h2>This is a test email from Nodemailer</h2>",
    });

    console.log("✅ Test email sent:", info.response);
  } catch (err) {
    console.error("❌ Email test failed:", err.message);
  }
};

sendTestEmail();