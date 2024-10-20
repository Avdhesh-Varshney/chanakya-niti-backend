import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

export const forgetPoasswrd = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a reset token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    // Create a Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.PASSWORD_APP_EMAIL, // Your app-specific password
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: req.body.email, // Recipient's email
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
             <p>Click on the following link to reset your password:</p>
             <a href="http://localhost:1001/api/reset-password/${token}">Reset Password</a>
             <p>The link will expire in 10 minutes.</p>
             <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred: ' + error.message);
        return res.status(500).send({ message: error.message });
      }
      console.log('Message sent: %s', info.messageId);
      res.status(200).send({ message: "Email sent" });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

export default forgetPoasswrd;
