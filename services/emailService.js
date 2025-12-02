import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetEmail = async (to, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Password Reset Link",
        html: `
            <p>You requested a password reset.</p>
            <p><a href="${resetLink}" target="_blank">Click here to reset your password</a></p>
            <p>This link is valid for 1 hour.</p>
        `
    };
    return transporter.sendMail(mailOptions);
};
