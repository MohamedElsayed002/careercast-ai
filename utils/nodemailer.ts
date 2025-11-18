import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Error sending email", error);
    throw error;
  }
}
