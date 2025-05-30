const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Function to send OTP email
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Your email address
      pass: process.env.EMAIL_PASS   // Your email password or app-specific password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Expensify - OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

// Route to send OTP for password reset
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via email
    await sendOtpEmail(email, otp);

    // Store OTP and expiration time in the database
    user.emailOtp = otp;
    user.emailOtpExpires = Date.now() + 5 * 60 * 1000;  // OTP expires in 5 minutes
    await user.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Route to verify the OTP entered by the user
router.post('/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user || user.emailOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (user.emailOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Clear OTP from database after successful verification
    user.emailOtp = null;
    user.emailOtpExpires = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// Route to reset the password after OTP verification
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the password (Make sure to hash the password in a real app)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;