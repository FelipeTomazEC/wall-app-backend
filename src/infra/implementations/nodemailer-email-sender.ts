import { EmailSender, SendEmailArgs } from "@use-cases/register-user/dependencies/email-sender.interface";
import { createTransport } from 'nodemailer';

export class NodeMailerEmailSender implements EmailSender {
  async sendEmail(args: SendEmailArgs): Promise<void> {
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? '587');
    const APPLICATION_EMAIL_USER = process.env.APPLICATION_EMAIL_USER;
    const APPLICATION_EMAIL_PASSWORD = process.env.APPLICATION_EMAIL_PASSWORD;

    const transporter  = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: APPLICATION_EMAIL_USER,
        pass: APPLICATION_EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Wall App 🧱" <${APPLICATION_EMAIL_USER}>`,
      to: args.to,
      subject: args.subject,
      html: args.content,
    });
  }
}