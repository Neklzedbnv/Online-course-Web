import { mailTransporter } from "../config/mail.js";

export const sendEmail = async (to, subject, text) => {
  await mailTransporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  });
};