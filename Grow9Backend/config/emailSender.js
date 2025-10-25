// sendEmail.js
const nodemailer = require("nodemailer");

// Create reusable transporter when module loads
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * Send an email using Gmail + Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body (use `html` if you prefer HTML)
 * @param {string} [html] - Optional HTML content
 */
async function sendEmail(to, subject, text, html = null) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    ...(html && { html }), // include html only if provided
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.response}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

// Export the function for use in other files
module.exports = sendEmail;
