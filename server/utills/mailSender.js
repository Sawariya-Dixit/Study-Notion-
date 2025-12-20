const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    const data = await resend.emails.send({
      from: "StudyNotion <onboarding@resend.dev>",
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent via Resend:", data);
    return data;

  } catch (error) {
    console.error("RESEND MAIL ERROR:", error);
    throw error;
  }
};

module.exports = mailSender;
