const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"node" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function regisMail(userEmail, name) {
  const subject = "created my first automated mail sender";

  const text = `hello ${name} how are you..?`;
  //Email clients that support HTML display the HTML content, and clients that do not support or allow HTML display the plain-text content

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Welcome, ${name}! 🎉</h2>
    <p>Your account has been successfully registered.</p>
    <p>We're excited to have you with us.</p>
    <br>
    <p>Thank you for joining!</p>
  </div>
`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = { regisMail };
