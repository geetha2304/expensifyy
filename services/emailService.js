const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Expensify" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Password Reset',
    html: `<h2>OTP for Expensify</h2><p>Your OTP is <strong>${otp}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
