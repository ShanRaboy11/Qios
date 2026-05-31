import { 
  B, 
  emailWrapper, 
  brandHeader, 
  emailFooter, 
  divider,
  resolveSmtpConfig,
  createTransporter
} from "./email";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function transcriptRows(fields: Array<{ label: string; value: string }>) {
  return fields
    .map(
      (field) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${B.border};vertical-align:top;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:${B.brownMid};font-weight:700;">${escapeHtml(field.label)}</p>
            <p style="margin:4px 0 0;font-size:14px;color:${B.textPrimary};line-height:1.6;white-space:pre-wrap;">${escapeHtml(field.value || "—")}</p>
          </td>
        </tr>
      `,
    )
    .join("");
}

function buildReceiptHtml(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}) {
  return emailWrapper(`
    ${brandHeader({
      title: "We received your message",
      subtitle: "Thanks for reaching out to Qios. Here is your message receipt.",
      pillLabel: "Contact Receipt",
      pillBg: B.goldSoft,
      pillBorder: B.border,
      pillColor: B.goldMid,
    })}
    <tr>
      <td style="padding:32px 40px;background:#fffdf8;">
        <p style="margin:0 0 16px;font-size:15px;color:${B.textPrimary};">Hi <strong>${escapeHtml(input.name)}</strong>,</p>
        <p style="margin:0 0 20px;font-size:14px;color:${B.textSecondary};line-height:1.7;">Your message has been sent successfully. Our team will review it and respond as soon as possible.</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ${B.border};border-radius:18px;background:#fff;overflow:hidden;">
          <tr>
            <td style="padding:18px 20px;background:${B.goldSoft};border-bottom:1px solid ${B.border};">
              <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:${B.goldMid};">Transcript</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${transcriptRows(
                [
                  { label: "Full Name", value: input.name },
                  { label: "Email Address", value: input.email },
                  { label: "Phone Number", value: input.phone || "" },
                  { label: "Company / Restaurant", value: input.company || "" },
                  { label: "Subject", value: input.subject },
                  { label: "Message", value: input.message },
                ],
              )}</table>
            </td>
          </tr>
        </table>
        
        ${divider}

        <p style="margin:0;font-size:13px;color:#b8a898;line-height:1.6;">
          If you have additional information, please reply directly to this email.
        </p>
      </td>
    </tr>
    ${emailFooter(`This email is a receipt of your contact form submission.`)}
  `);
}

function buildNotificationHtml(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}) {
  return emailWrapper(`
    ${brandHeader({
      title: "New contact form submission",
      subtitle: "A visitor has sent a message from the public contact page.",
      pillLabel: "Inbound Contact",
      pillBg: B.coralSoft,
      pillBorder: "#ffb3bd",
      pillColor: B.coral,
    })}
    <tr>
      <td style="padding:32px 40px;background:#fffdf8;">
        <p style="margin:0 0 16px;font-size:15px;color:${B.textPrimary};">Sender: <strong>${escapeHtml(input.name)}</strong> &lt;${escapeHtml(input.email)}&gt;</p>
        <p style="margin:0 0 20px;font-size:14px;color:${B.textSecondary};line-height:1.7;">Please review the message below and respond directly if needed.</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid ${B.border};border-radius:18px;background:#fff;overflow:hidden;">
          <tr>
            <td style="padding:18px 20px;background:${B.coralSoft};border-bottom:1px solid ${B.border};">
              <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:${B.coral};">Message Transcript</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${transcriptRows(
                [
                  { label: "Full Name", value: input.name },
                  { label: "Email Address", value: input.email },
                  { label: "Phone Number", value: input.phone || "" },
                  { label: "Company / Restaurant", value: input.company || "" },
                  { label: "Subject", value: input.subject },
                  { label: "Message", value: input.message },
                ],
              )}</table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${emailFooter(`This notification was sent securely via Qios.`)}
  `);
}

export async function sendContactSubmissionEmails(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}) {
  const smtp = await resolveSmtpConfig();
  if (!smtp) {
    return {
      success: false as const,
      reason: "SMTP_NOT_CONFIGURED" as const,
      error: new Error("SMTP is not fully configured."),
    };
  }

  const transporter = createTransporter(smtp);

  try {
    const [receiptResult, notificationResult] = await Promise.allSettled([
      transporter.sendMail({
        from: smtp.from,
        to: input.email,
        replyTo: smtp.from.address,
        subject: `We received your message — ${input.subject}`,
        html: buildReceiptHtml(input),
      }),
      transporter.sendMail({
        from: smtp.from,
        to: "exceptionhandlers4@gmail.com",
        replyTo: input.email,
        subject: `New contact message — ${input.name}`,
        html: buildNotificationHtml(input),
      }),
    ]);

    const failed = [receiptResult, notificationResult].find(
      (result) => result.status === "rejected",
    );

    if (failed?.status === "rejected") {
      return {
        success: false as const,
        reason: "SMTP_SEND_FAILED" as const,
        error: failed.reason,
      };
    }

    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      reason: "SMTP_SEND_FAILED" as const,
      error,
    };
  }
}
