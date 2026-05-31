import nodemailer from "nodemailer";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const isDevelopment = process.env.NODE_ENV !== "production";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: {
    name: string;
    address: string;
  };
};

const B = {
  gold: "#ffd77a",
  goldSoft: "#fff3da",
  goldMid: "#c07a00",
  cream: "#fff9ef",
  creamDark: "#fdf4e3",
  border: "#f0e6d3",
  brownMid: "#8b6f47",
  coral: "#ff5269",
  coralSoft: "#ffe4e8",
  textPrimary: "#2d2d2d",
  textSecondary: "#707070",
  muted: "#6a7282",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const portRaw = process.env.SMTP_PORT || process.env.MAIL_PORT || "587";
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass =
    process.env.SMTP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.MAIL_PASSWORD ||
    process.env.MAIL_PASS;
  const fromName =
    process.env.SMTP_FROM_NAME || process.env.MAIL_FROM_NAME || "Qios";
  const fromAddress =
    process.env.SMTP_USER ||
    process.env.SMTP_FROM_EMAIL ||
    process.env.MAIL_FROM_EMAIL ||
    user ||
    process.env.SMTP_FROM ||
    process.env.MAIL_FROM ||
    "";

  if (!host || !user || !pass || !fromAddress) return null;

  const port = Number.parseInt(portRaw, 10);
  return {
    host,
    port: Number.isNaN(port) ? 587 : port,
    secure: port === 465,
    user,
    pass,
    from: { name: fromName, address: fromAddress },
  };
}

const createTransporter = (config: SmtpConfig) =>
  nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    tls: { rejectUnauthorized: false },
  });

async function resolveSmtpConfig(): Promise<SmtpConfig | null> {
  const envConfig = readSmtpConfig();

  try {
    const supabase = createSupabaseAdminClient();
    if (!supabase) return envConfig;

    const { data, error } = await supabase
      .from("platform_settings")
      .select(
        "smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, smtp_from_name, smtp_from_email",
      )
      .limit(1)
      .maybeSingle();

    if (error || !data) return envConfig;

    const host = (data.smtp_host as string) || envConfig?.host;
    const port = Number(data.smtp_port || envConfig?.port || 587);
    const user = (data.smtp_user as string) || envConfig?.user;
    const pass = (data.smtp_password as string) || envConfig?.pass;
    const fromName =
      (data.smtp_from_name as string) || envConfig?.from?.name || "Qios";
    const fromAddress =
      (data.smtp_from_email as string) ||
      envConfig?.from?.address ||
      user ||
      "";
    const secure =
      typeof data.smtp_secure === "boolean" ? data.smtp_secure : port === 465;

    if (!host || !user || !pass || !fromAddress) return envConfig;

    return {
      host,
      port,
      secure,
      user,
      pass,
      from: { name: fromName, address: fromAddress },
    };
  } catch {
    return envConfig;
  }
}

function wrapper(content: string) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${B.cream};margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;background:#fff;border:1px solid ${B.border};border-radius:24px;overflow:hidden;box-shadow:0 18px 48px rgba(90,58,26,0.10);">
            ${content}
            <tr>
              <td style="background:${B.creamDark};padding:18px 28px;text-align:center;border-top:1px solid ${B.border};">
                <p style="margin:0;font-size:12px;color:${B.muted};line-height:1.6;">&copy; ${new Date().getFullYear()} <strong style="color:${B.goldMid};">Qios</strong></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function header(pillLabel: string, title: string, subtitle: string) {
  return `
    <tr>
      <td style="background:linear-gradient(180deg,#fffdf7 0%,#fffaf0 100%);padding:34px 40px 30px;border-bottom:1px solid ${B.border};text-align:center;">
        <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:${B.coralSoft};color:${B.coral};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px;">${escapeHtml(pillLabel)}</div>
        <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:${B.textPrimary};line-height:1.3;">${escapeHtml(title)}</p>
        <p style="margin:0;font-size:14px;color:${B.brownMid};line-height:1.5;">${escapeHtml(subtitle)}</p>
      </td>
    </tr>
  `;
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
  return wrapper(`
    ${header(
      "Contact Receipt",
      "We received your message",
      "Thanks for reaching out to Qios. Here is your message receipt.",
    )}
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
      </td>
    </tr>
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
  return wrapper(`
    ${header(
      "Inbound Contact",
      "New contact form submission",
      "A visitor has sent a message from the public contact page.",
    )}
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
    if (isDevelopment) {
      console.warn(
        "[contactEmail] SMTP is not configured. Returning success in development mode.",
      );
      return { success: true as const };
    }

    return {
      success: false as const,
      reason: "SMTP_NOT_CONFIGURED" as const,
      error: new Error("SMTP is not fully configured."),
    };
  }

  const transporter = createTransporter(smtp);

  try {
    await transporter.sendMail({
      from: smtp.from,
      to: input.email,
      replyTo: smtp.from.address,
      subject: `We received your message — ${input.subject}`,
      html: buildReceiptHtml(input),
    });

    await transporter.sendMail({
      from: smtp.from,
      to: "exceptionhandlers4@gmail.com",
      replyTo: input.email,
      subject: `New contact message — ${input.name}`,
      html: buildNotificationHtml(input),
    });

    return { success: true as const };
  } catch (error) {
    if (isDevelopment) {
      console.warn(
        "[contactEmail] SMTP send failed in development. Returning success.",
        error,
      );
      return { success: true as const };
    }

    return {
      success: false as const,
      reason: "SMTP_SEND_FAILED" as const,
      error,
    };
  }
}
