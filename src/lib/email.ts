import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationOtp(
  email: string,
  name: string,
  otp: string,
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your CollegeFinder verification code",

    text: `Hi ${name},

Your CollegeFinder verification code is:

${otp}

This code expires in 10 minutes.

If you did not create a CollegeFinder account, you can safely ignore this email.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 560px;
        margin: 0 auto;
        padding: 32px;
        background: #f8fafc;
      ">
        <div style="
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        ">
          <h1 style="
            margin: 0 0 24px;
            color: #0f172a;
          ">
            College<span style="color: #06b6d4;">Finder</span>
          </h1>

          <h2 style="color: #0f172a;">
            Verify your email
          </h2>

          <p style="color: #475569;">
            Hi ${name},
          </p>

          <p style="color: #475569;">
            Enter the verification code below to verify
            your CollegeFinder account.
          </p>

          <div style="
            margin: 28px 0;
            padding: 18px;
            background: #ecfeff;
            border-radius: 12px;
            text-align: center;
            letter-spacing: 8px;
            font-size: 30px;
            font-weight: 700;
            color: #0891b2;
          ">
            ${otp}
          </div>

          <p style="color: #64748b;">
            This code expires in 10 minutes.
          </p>

          <p style="color: #64748b;">
            If you did not create this account, you can
            safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}