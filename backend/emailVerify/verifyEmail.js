import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const verifyEmail = (token, email) => {
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

    subject: "Verify Your Email",

    text: `Hi there,

You have recently visited our website.

Please click the link below to verify your email:

${process.env.CLIENT_URL || "https://cartverse-1.onrender.com"}/verify/${token}

Thanks.`,
  };

  // Send mail
  transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
};
