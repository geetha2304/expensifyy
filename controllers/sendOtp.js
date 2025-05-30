// controllers/sendOtp.js
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating a random OTP

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtp = (email) => {
  return new Promise((resolve, reject) => {
    const otp = crypto.randomInt(100000, 999999);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Forgot Password',
      text: `Your OTP for resetting your password is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error); // Log the error to console
        reject('Error sending OTP email: ' + error); // Reject with error message
      } else {
        console.log('OTP sent successfully:', info); // Log the success info
        resolve(otp); // Return OTP (optional: store in session or DB)
      }
    });
  });
};

module.exports = sendOtp;
