import nodemailer from 'nodemailer';

export const sendBusinessVerificationEmail = async ({
  to,
  status,
  comments,
}: {
  to: string;
  status: 'approved' | 'rejected';
  comments?: string | null;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

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
