import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTPMail = (email, otp) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 465,
    secure: process.env.MAIL_PORT == 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Mail configuration
  const mailConfiguration = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,

    to: email,

    subject: "Password Reset OTP",

   html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`

  }
  // Send mail
  transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
};
