import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
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
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Qios" <noreply@qios.com>',
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
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
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
  const transporter = createTransporter();

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
    from: '"Qios" <noreply@qios.com>', // Sender address
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
