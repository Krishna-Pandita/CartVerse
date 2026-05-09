import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const verifyEmail = (token, email) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Mail configuration
  const mailConfiguration = {
    from: process.env.MAIL_USER,

    to: email,

    subject: "Verify Your Email",

    text: `Hi there,

You have recently visited our website.

Please click the link below to verify your email:

http://localhost:5173/verify/${token}

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
