import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.EMAIL_USER) {
    logger.warn('Email service not configured. Skipping email to: ' + to);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"AMU Dormitory Maintenance" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email Service Error: ' + error.message);
  }
};

export const sendStatusUpdateEmail = async (user, request, status) => {
  const subject = `Status Update: Request #${request.id.substring(0, 8)}`;
  const text = `Hello ${user.name},\n\nYour maintenance request "${request.title}" has been updated to: ${status}.\n\nNotes: ${request.notes || 'No additional notes.'}\n\nThank you,\nAMU Maintenance Team`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0ea5e9;">Maintenance Update</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your maintenance request "<strong>${request.title}</strong>" has been updated to: <span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: bold; color: #1e293b;">${status}</span></p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #64748b;"><strong>Notes:</strong></p>
        <p style="margin: 5px 0 0 0;">${request.notes || 'No additional notes.'}</p>
      </div>
      <p style="color: #94a3b8; font-size: 14px;">This is an automated notification from the AMU Dormitory Maintenance System.</p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};
