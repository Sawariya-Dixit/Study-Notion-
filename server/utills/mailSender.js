const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,      // smtp.gmail.com
  port: 587,
  secure: false,                    // TLS
  auth: {
    user: process.env.MAIL_USER,    // your email
    pass: process.env.MAIL_PASS,    // app password
  },
  connectionTimeout: 10000,         // 10s
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const mailSender = async (email, title, body) => {
  try {
    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("SMTP Mail Sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("SMTP MAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = mailSender;
