const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,   // important
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: "StudyNotion || SANWARIYA DIXIT",
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email Sent: ", info.messageId);
        return info;

    } catch (error) {
        console.log("MAIL ERROR:", error);
        // can't use res here → throw error
        throw error;
    }
};

module.exports = mailSender;
