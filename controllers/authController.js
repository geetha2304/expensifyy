const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// SEND OTP
const sendOTP = async (req, res) => {
  // Dummy logic for now
  const { email } = req.body;
  // Generate OTP and send using nodemailer or Fast2SMS
  res.status(200).json({ msg: `OTP sent to ${email}` });
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ msg: "Password updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error resetting password" });
  }
};

// EXPORT ALL
module.exports = {
  login,
  sendOTP,
  resetPassword,
};