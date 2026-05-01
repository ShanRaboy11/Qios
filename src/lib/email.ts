import nodemailer from 'nodemailer';

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

const readSmtpConfig = (): SmtpConfig | null => {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const portRaw = process.env.SMTP_PORT || process.env.MAIL_PORT || '587';
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass =
    process.env.SMTP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.MAIL_PASSWORD ||
    process.env.MAIL_PASS;
  const from = process.env.SMTP_FROM || process.env.MAIL_FROM || user;

  if (!host || !user || !pass || !from) {
    return null;
  }

  const port = Number.parseInt(portRaw, 10);
  const isSecure = port === 465;

  return {
    host,
    port: Number.isNaN(port) ? 587 : port,
    secure: isSecure,
    user,
    pass,
    from,
  };
};

const createTransporter = (config: SmtpConfig) =>
  nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

export const sendContactVerificationEmail = async ({
  to,
  businessName,
  code,
}: {
  to: string;
  businessName: string;
  code: string;
}) => {
  const smtp = readSmtpConfig();

  if (!smtp) {
    return {
      success: false,
      reason: 'SMTP_NOT_CONFIGURED' as const,
      error: new Error('SMTP is not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.'),
    };
  }

  const transporter = createTransporter(smtp);

  const mailOptions = {
    from: smtp.from,
    to,
    subject: 'Verify Your Business Email - Qios',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1f2937;">
        <h2 style="margin: 0 0 12px; font-size: 24px;">Verify your business email</h2>
        <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${businessName},</p>
        <p style="margin: 0 0 16px; line-height: 1.6;">Use the verification code below to continue your Qios onboarding:</p>
        <div style="display:inline-block; padding: 16px 22px; border-radius: 12px; background: #111827; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.24em;">${code}</div>
        <p style="margin: 16px 0 0; line-height: 1.6;">If you did not request this code, you can ignore this email.</p>
        <p style="margin: 16px 0 0; line-height: 1.6;">Best regards,<br />Qios</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true as const, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false as const, reason: 'SMTP_SEND_FAILED' as const, error };
  }
};

export const sendBusinessVerificationEmail = async ({
  to,
  status,
  comments,
}: {
  to: string;
  status: 'approved' | 'rejected';
  comments?: string | null;
}) => {
  const smtp = readSmtpConfig();

  if (!smtp) {
    return {
      success: false,
      reason: 'SMTP_NOT_CONFIGURED' as const,
      error: new Error('SMTP is not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.'),
    };
  }

  const transporter = createTransporter(smtp);

  const subject =
    status === 'approved'
      ? 'Your Business Onboarding has been Approved - Qios'
      : 'Update on Your Business Onboarding - Qios';

  let htmlContent = '';

  if (status === 'approved') {
    htmlContent = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Congratulations!</h2>
        <p>Your business has been officially verified and approved on Qios.</p>
        <p>You can now log in and access all features.</p>
        <p>Best regards,<br/>The Qios Team</p>
      </div>
    `;
  } else {
    htmlContent = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Onboarding Update</h2>
        <p>Thank you for submitting your business verification documents to Qios.</p>
        <p>Unfortunately, your application requires further action or has been rejected at this time.</p>
        ${comments ? `<p><strong>Comments from Admin:</strong><br/>${comments}</p>` : ''}
        <p>Please address these issues and contact our support if you have any questions.</p>
        <p>Best regards,<br/>The Qios Team</p>
      </div>
    `;
  }

  const mailOptions = {
    from: smtp.from,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true as const, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false as const, reason: 'SMTP_SEND_FAILED' as const, error };
  }
};

export const sendRegistrationSuccessEmail = async ({
  to,
  businessName,
}: {
  to: string;
  businessName: string;
}) => {
  const smtp = readSmtpConfig();

  if (!smtp) {
    return {
      success: false,
      reason: 'SMTP_NOT_CONFIGURED' as const,
      error: new Error('SMTP is not fully configured.'),
    };
  }

  const transporter = createTransporter(smtp);

  const mailOptions = {
    from: smtp.from,
    to,
    subject: 'Registration Submitted - Qios',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1f2937;">
        <h2 style="margin: 0 0 12px; font-size: 24px;">Thank you for registering with Qios!</h2>
        <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${businessName},</p>
        <p style="margin: 0 0 16px; line-height: 1.6;">Your registration has been successfully submitted. We appreciate your interest in Qios!</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-left: 4px solid #f97316; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px; font-weight: 600;">⏳ What happens next?</p>
          <p style="margin: 0 0 8px; line-height: 1.6;">Our team will review your business documents and verify your information. This process typically takes <strong>2-3 business days</strong>.</p>
          <p style="margin: 0; line-height: 1.6;">You will receive an email notification once your registration has been <strong>approved</strong> or if we need any additional information.</p>
        </div>
        <p style="margin: 16px 0 0; line-height: 1.6;">In the meantime, if you have any questions, feel free to contact our support team.</p>
        <p style="margin: 16px 0 0; line-height: 1.6;">Best regards,<br />The Qios Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true as const, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending registration success email:', error);
    return { success: false as const, reason: 'SMTP_SEND_FAILED' as const, error };
  }
};
