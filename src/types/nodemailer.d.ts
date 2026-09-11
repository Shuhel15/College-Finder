declare module "nodemailer" {
  type MailOptions = {
    from?: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  };

  type Transporter = {
    sendMail(options: MailOptions): Promise<unknown>;
  };

  const nodemailer: {
    createTransport(options: {
      host?: string;
      port?: number;
      secure?: boolean;
      auth?: {
        user?: string;
        pass?: string;
      };
    }): Transporter;
  };

  export default nodemailer;
}
