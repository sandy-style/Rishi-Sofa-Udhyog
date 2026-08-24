import { transporter } from "./emailconfig.js";
import nodemailer from "nodemailer";
export const sendEmail = async (email, verificationcode) => {
  try {
    const info = await transporter.sendMail({
      from: '"RSU" <${process.env.SMTP_USER}>', // sender address
      to: email, // list of recipients
      subject: "Verification Code", // subject line
      text: `Your verification code is: ${verificationcode}`, // plain text body
      html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your email</h2>

        <p>Use the verification code below:</p>

        <h1 style="letter-spacing: 5px;">
          ${verificationcode}
        </h1>

        <p>This code expires in 10 minutes.</p>

        <p>If you didn't create an account, you can ignore this email.</p>
      </div>
    `, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
