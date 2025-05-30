const nodemailer = require("nodemailer");
// Optional: Fast2SMS integration (SMS API) if needed

const sendEmailOTP = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Expensify OTP Verification",
    html: `<h3>Your OTP is: ${otp}</h3><p>Valid for 5 minutes</p>`,
  });
};

module.exports = { sendEmailOTP };
