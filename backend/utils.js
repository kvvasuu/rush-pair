import nodemailer from "nodemailer";
import { rateLimit } from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { msg: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const calculateYearsSince = (dateString) => {
  const givenDate = new Date(dateString);
  const today = new Date();

  let yearsDifference = today.getFullYear() - givenDate.getFullYear();

  if (
    today.getMonth() < givenDate.getMonth() ||
    (today.getMonth() === givenDate.getMonth() &&
      today.getDate() < givenDate.getDate())
  ) {
    yearsDifference--;
  }

  return yearsDifference;
};

const sendEmail = async ({ from, to, subject, html }) => {
  const NODEMAILER_USER = process.env.NODEMAILER_USER;
  const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions).catch((error) => console.log(error));
};

export { calculateYearsSince, sendEmail, rateLimiter };
