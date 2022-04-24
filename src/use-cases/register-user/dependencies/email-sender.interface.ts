export type SendEmailArgs = {
  to: string;
  subject: string;
  content: string;
};

export interface EmailSender {
  sendEmail(args: SendEmailArgs): Promise<void>;
}
