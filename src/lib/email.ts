import nodemailer from "nodemailer";

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

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
// Sourced from globals.css / kds design tokens

const B = {
  gold: "#ffd77a", // --kds-gold / --color-brand-secondary
  goldSoft: "#fff3da", // --kds-gold-soft
  goldMid: "#c07a00", // --kds-gold-mid
  goldDark: "#9a6200", // --kds-gold-dark
  goldDeeper: "#7a5800", // --kds-gold-deeper
  cream: "#fff9ef", // --color-bg-primary / --kds-cream
  creamDark: "#fdf4e3",
  border: "#f0e6d3", // --kds-border-warm
  brownDark: "#5a3a1a", // --kds-brown-dark
  brownMid: "#8b6f47", // --kds-brown-mid
  primary: "#ffc670", // --color-brand-primary
  coral: "#ff5269", // --color-brand-accent / --kds-coral
  coralSoft: "#ffe4e8", // --kds-coral-soft
  green: "#1fad66", // --kds-green / --color-success-primary
  greenSoft: "#e0fad6", // --kds-green-soft / --color-success-secondary
  dark: "#101828", // --kds-dark
  muted: "#6a7282", // --kds-muted
  textPrimary: "#2d2d2d", // --color-text-primary
  textSecondary: "#707070", // --color-text-secondary
};

// ─── SMTP ─────────────────────────────────────────────────────────────────────

const readSmtpConfig = (): SmtpConfig | null => {
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
    from: {
      name: fromName,
      address: fromAddress,
    },
  };
};

const createTransporter = (config: SmtpConfig) =>
  nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });

const normalizePublicBaseUrl = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const publicBaseUrl = normalizePublicBaseUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
);

const brandFontOtfUrl =
  process.env.IBRAND_FONT_OTF_URL ||
  (publicBaseUrl ? `${publicBaseUrl}/fonts/ibrand.otf` : "");

const brandFontSrc = [
  brandFontOtfUrl ? `url('${brandFontOtfUrl}') format('opentype')` : "",
]
  .filter(Boolean)
  .join(",\n             ");

const brandFontFace = brandFontSrc
  ? `<style>
      @font-face {
        font-family: 'IBrand';
        src: ${brandFontSrc};
        font-weight: 700;
        font-style: normal;
      }
    </style>`
  : "";

// ─── Shared Partials ──────────────────────────────────────────────────────────

/**
 * Outer page shell. Warm parchment background, centred card, global footer.
 */
const emailWrapper = (body: string) =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Qios</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4ede0;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4ede0;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;width:100%;background:#fffdf8;border-radius:20px;overflow:hidden;
                           box-shadow:0 4px 32px rgba(160,100,30,0.12),0 1px 4px rgba(160,100,30,0.06);
                            border:1px solid rgba(255,215,122,0.2);">
          ${body}
        </table>

        <!-- Global footer -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;width:100%;margin-top:20px;">
          <tr>
            <td align="center" style="padding:0 16px;">
              <p style="margin:0;font-size:12px;color:#b8a898;line-height:1.7;text-align:center;">
                You're receiving this because an account action was initiated with this email address.<br/>
                &copy; ${new Date().getFullYear()} <strong style="color:${B.goldMid};">Qios</strong> &mdash; All rights reserved.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

// ─── Logo ─────────────────────────────────────────────────────────────────────
// Text-only wordmark with Outlook-safe fallback.

const qiosLogo = `
<!--[if mso]>
<strong style="font-size:48px;font-weight:700;font-family:Georgia,serif;color:${B.goldMid};letter-spacing:-0.02em;line-height:1;">Qios</strong>
<![endif]-->
<!--[if !mso]><!-->
<span style="font-size:48px;font-weight:700;
             font-family:'IBrand','Figtree','Segoe UI',Arial,sans-serif;
             color:#ffc670;
             letter-spacing:-0.02em;line-height:1;display:inline-block;">Qios</span>
<!--<![endif]-->`;

// ─── Blob decorations ─────────────────────────────────────────────────────────
// SVG-based; works across clients without position:absolute hacks.
// Two blobs: top-right (gold→primary) and bottom-left (coral, very faint).

const headerBlobs = `
<tr>
  <td style="padding:0;line-height:0;font-size:0;" aria-hidden="true">
    <!--[if !mso]><!-->
    <div style="position:relative;height:0;overflow:visible;pointer-events:none;">
      <!-- Top-right warm blob -->
      <svg width="180" height="160" viewBox="0 0 180 160" fill="none"
           xmlns="http://www.w3.org/2000/svg"
           style="position:absolute;top:-148px;right:-8px;opacity:0.55;pointer-events:none;">
        <defs>
          <radialGradient id="blob1" cx="60%" cy="40%" r="55%">
            <stop offset="0%"   stop-color="#ffd77a" stop-opacity="0.7"/>
            <stop offset="55%"  stop-color="#ffc670" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#ffc670" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="68" rx="90" ry="78" fill="url(#blob1)"/>
      </svg>
      <!-- Bottom-left coral accent blob -->
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none"
           xmlns="http://www.w3.org/2000/svg"
           style="position:absolute;top:-30px;left:-12px;opacity:0.18;pointer-events:none;">
        <defs>
          <radialGradient id="blob2" cx="40%" cy="55%" r="50%">
            <stop offset="0%"   stop-color="#ff5269" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ff5269" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="55" cy="52" rx="65" ry="55" fill="url(#blob2)"/>
      </svg>
    </div>
    <!--<![endif]-->
  </td>
</tr>`;

// ─── Header ───────────────────────────────────────────────────────────────────
// pill* params are explicit so callers never guess at colours.

const brandHeader = ({
  title,
  subtitle,
  pillLabel,
  pillBg,
  pillBorder,
  pillColor,
}: {
  title: string;
  subtitle: string;
  pillLabel: string;
  pillBg: string;
  pillBorder: string;
  pillColor: string;
}) => `
${headerBlobs}
<tr>
  <td style="background:linear-gradient(155deg,#fffdf8 0%,#fff3da 55%,#ffe8c2 100%);
             padding:36px 40px 32px;border-bottom:1px solid ${B.border};">

    <!-- Logo -->
    <p style="margin:0 0 20px;text-align:center;line-height:1;">${qiosLogo}</p>

    <!-- Title & subtitle -->
    <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:${B.textPrimary};
              line-height:1.3;font-family:'Segoe UI',Arial,sans-serif;text-align:center;">${title}</p>
    <p style="margin:0;font-size:14px;color:${B.brownMid};line-height:1.5;text-align:center;">${subtitle}</p>
  </td>
</tr>`;

// ─── Footer row ───────────────────────────────────────────────────────────────

const emailFooter = (note: string) => `
<tr>
  <td style="background:linear-gradient(160deg,${B.cream} 0%,${B.creamDark} 100%);
             border-top:1px solid ${B.border};padding:20px 40px;">
    <p style="margin:0;font-size:12px;color:#b8a898;line-height:1.6;text-align:center;">${note}</p>
  </td>
</tr>`;

// ─── Divider ──────────────────────────────────────────────────────────────────

const divider = `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:20px 0;">
  <tr><td style="border-top:1px solid ${B.border};"></td></tr>
</table>`;

// ─── Numbered step row ────────────────────────────────────────────────────────

const stepRow = (num: string, title: string, desc: string) => `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
  <tr>
    <td style="vertical-align:top;width:32px;">
      <div style="width:24px;height:24px;border-radius:50%;
                  background-color:${B.goldSoft};border:1.5px solid ${B.gold};
                  text-align:center;line-height:22px;font-size:12px;font-weight:700;
                  color:${B.goldDark};">${num}</div>
    </td>
    <td style="vertical-align:top;padding-left:12px;">
      <p style="margin:0;font-size:13px;color:${B.textPrimary};line-height:1.6;">
        <strong>${title}</strong> &mdash; ${desc}
      </p>
    </td>
  </tr>
</table>`;

// ─── 1. Contact Verification (OTP) Email ──────────────────────────────────────

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
      reason: "SMTP_NOT_CONFIGURED" as const,
      error: new Error(
        "SMTP is not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.",
      ),
    };
  }

  const digits = code.split("");
  const mid = Math.floor(digits.length / 2);
  const left = digits.slice(0, mid);
  const right = digits.slice(mid);

  const tile = (d: string) =>
    `<td style="padding:0 4px;">
       <div style="width:44px;height:56px;background:${B.goldSoft};
                   border:2px solid ${B.gold};border-radius:10px;text-align:center;
                   line-height:56px;font-size:26px;font-weight:700;color:${B.goldDark};
                   font-family:'Courier New',monospace;
                   box-shadow:0 2px 8px rgba(192,122,0,0.12);">${d}</div>
     </td>`;

  const sep = `<td style="padding:0 8px;vertical-align:middle;font-size:22px;
                           color:${B.border};line-height:56px;">&middot;</td>`;

  const isPersonalized = Boolean(
    businessName &&
    !businessName.includes("@") &&
    businessName.trim() &&
    businessName.trim() !== to,
  );
  const subject = isPersonalized
    ? "Verify Your Business Email — Qios"
    : "Security Code — Qios";

  const greetingHtml = isPersonalized
    ? `<p style="margin:0 0 10px;font-size:15px;color:${B.textPrimary};">Hi <strong>${businessName}</strong>,</p>`
    : `<p style="margin:0 0 10px;font-size:15px;color:${B.textPrimary};">Hello,</p>
       <p style="margin:0 0 8px;font-size:14px;color:${B.textSecondary};line-height:1.7;">Use the security code below to verify this email address.</p>`;

  const html = emailWrapper(`
    ${brandHeader({
      title: "One step away from your dashboard",
      subtitle: "Enter the code below to verify your business email address",
      pillLabel: "Secure Action",
      pillBg: B.coralSoft,
      pillBorder: "#ffb3bd",
      pillColor: B.coral,
    })}

    <tr>
      <td style="padding:32px 40px 28px;background:#fffdf8;">
        ${greetingHtml}
        ${isPersonalized ? `<p style="margin:0 0 24px;font-size:14px;color:${B.textSecondary};line-height:1.7;">To complete your Qios onboarding, enter this verification code in the app. It confirms that this email address belongs to your business.</p>` : ""}

        <!-- OTP block -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="background:linear-gradient(145deg,${B.goldSoft} 0%,#fff8e6 100%);
                      border:1.5px solid ${B.gold};border-radius:14px;margin-bottom:24px;
                      box-shadow:0 4px 18px rgba(255,215,122,0.25);">
          <tr>
            <td align="center" style="padding:24px 20px 10px;">
              <p style="margin:0 0 14px;font-size:11px;color:${B.goldDark};
                        text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">
                Your verification code
              </p>
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  ${left.map(tile).join("")}
                  ${sep}
                  ${right.map(tile).join("")}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:10px 20px 20px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color:${B.border};border-radius:20px;padding:4px 14px;">
                    <p style="margin:0;font-size:11px;color:${B.brownMid};font-weight:500;">
                      &#x23F3; Expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${divider}

        <p style="margin:0;font-size:13px;color:#b8a898;line-height:1.6;">
          If you did not request this code, you can safely ignore this email.
          Someone may have entered your address by mistake.
        </p>
      </td>
    </tr>

    ${emailFooter(`This email was sent to <strong style="color:${B.textPrimary};">${to}</strong> as part of the Qios onboarding process.`)}
  `);

  const transporter = createTransporter(smtp);
  try {
    const info = await transporter.sendMail({
      from: smtp.from,
      to,
      subject: "Verify Your Business Email — Qios",
      html,
    });
    return { success: true as const, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false as const,
      reason: "SMTP_SEND_FAILED" as const,
      error,
    };
  }
};

// ─── 2. Security Verification Code Email ──────────────────────────────────────

export const sendSecurityVerificationEmail = async ({
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
      reason: "SMTP_NOT_CONFIGURED" as const,
      error: new Error(
        "SMTP is not fully configured.",
      ),
    };
  }

  const digits = code.split("");
  const mid = Math.floor(digits.length / 2);
  const left = digits.slice(0, mid);
  const right = digits.slice(mid);

  const tile = (d: string) =>
    `<td style="padding:0 4px;">
       <div style="width:44px;height:56px;background:${B.goldSoft};
                   border:2px solid ${B.gold};border-radius:10px;text-align:center;
                   line-height:56px;font-size:26px;font-weight:700;color:${B.goldDark};
                   font-family:'Courier New',monospace;
                   box-shadow:0 2px 8px rgba(192,122,0,0.12);">${d}</div>
     </td>`;

  const sep = `<td style="padding:0 8px;vertical-align:middle;font-size:22px;
                           color:${B.border};line-height:56px;">&middot;</td>`;

  const isPersonalized = Boolean(businessName && !businessName.includes("@"));

  const subject = "Security Verification Code — Qios";
  const greetingHtml = isPersonalized
    ? `<p style="margin:0 0 10px;font-size:15px;color:${B.textPrimary};">Hi <strong>${businessName}</strong>,</p>`
    : `<p style="margin:0 0 10px;font-size:15px;color:${B.textPrimary};">Hello,</p>`;

  const html = emailWrapper(`
    ${brandHeader({
      title: "Security Verification Code",
      subtitle: "Enter the code below to verify your identity",
      pillLabel: "Secure Action",
      pillBg: B.coralSoft,
      pillBorder: "#ffb3bd",
      pillColor: B.coral,
    })}

    <tr>
      <td style="padding:32px 40px 28px;background:#fffdf8;">
        ${greetingHtml}
        <p style="margin:0 0 24px;font-size:14px;color:${B.textSecondary};line-height:1.7;">A request was made to verify your identity. Please use the verification code below to proceed.</p>

        <!-- OTP block -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="background:linear-gradient(145deg,${B.goldSoft} 0%,#fff8e6 100%);
                      border:1.5px solid ${B.gold};border-radius:14px;margin-bottom:24px;
                      box-shadow:0 4px 18px rgba(255,215,122,0.25);">
          <tr>
            <td align="center" style="padding:24px 20px 10px;">
              <p style="margin:0 0 14px;font-size:11px;color:${B.goldDark};
                        text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">
                Your verification code
              </p>
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  ${left.map(tile).join("")}
                  ${sep}
                  ${right.map(tile).join("")}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:10px 20px 20px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color:${B.border};border-radius:20px;padding:4px 14px;">
                    <p style="margin:0;font-size:11px;color:${B.brownMid};font-weight:500;">
                      &#x23F3; Expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${divider}

        <p style="margin:0;font-size:13px;color:#b8a898;line-height:1.6;">
          If you did not request this code, you can safely ignore this email. Someone may have entered your address by mistake.
        </p>
      </td>
    </tr>

    ${emailFooter(`This email was sent to <strong style="color:${B.textPrimary};">${to}</strong> to verify a security action.`)}
  `);

  const transporter = createTransporter(smtp);
  try {
    const info = await transporter.sendMail({
      from: smtp.from,
      to,
      subject,
      html,
    });
    return { success: true as const, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false as const,
      reason: "SMTP_SEND_FAILED" as const,
      error,
    };
  }
};

// ─── 3. Business Verification Status Email ────────────────────────────────────

export const sendBusinessVerificationEmail = async ({
  to,
  status,
  comments,
}: {
  to: string;
  status: "approved" | "rejected";
  comments?: string | null;
}) => {
  const smtp = readSmtpConfig();
  if (!smtp) {
    return {
      success: false,
      reason: "SMTP_NOT_CONFIGURED" as const,
      error: new Error(
        "SMTP is not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.",
      ),
    };
  }

  const isApproved = status === "approved";

  const subject = isApproved
    ? "Your Business has been Approved — Qios"
    : "Update on Your Business Onboarding — Qios";

  // ── Status banner ──
  const statusBanner = isApproved
    ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="background-color:${B.greenSoft};border:1px solid #a3e8c6;
                    border-radius:10px;margin-bottom:20px;">
        <tr>
          <td style="padding:16px 20px;">
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="vertical-align:top;padding-right:12px;">
                  <div style="width:32px;height:32px;border-radius:50%;
                              background-color:${B.green};text-align:center;
                              line-height:32px;font-size:15px;font-weight:700;color:#ffffff;">&#10003;</div>
                </td>
                <td style="vertical-align:top;">
                  <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:#0a5c34;">Business verification approved</p>
                  <p style="margin:0;font-size:13px;color:${B.muted};line-height:1.5;">
                    Your documents have been reviewed and your business is now active on the Qios platform.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
    : `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="background-color:${B.coralSoft};border:1px solid #ffb3bd;
                    border-radius:10px;margin-bottom:20px;">
        <tr>
          <td style="padding:16px 20px;">
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="vertical-align:top;padding-right:12px;">
                  <div style="width:32px;height:32px;border-radius:50%;
                              background-color:${B.coral};text-align:center;
                              line-height:32px;font-size:16px;font-weight:700;color:#ffffff;">!</div>
                </td>
                <td style="vertical-align:top;">
                  <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:#9b1c33;">Verification requires further action</p>
                  <p style="margin:0;font-size:13px;color:${B.muted};line-height:1.5;">
                    Please review the feedback below and resubmit your application with the requested changes.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;

  // ── Reviewer comments (rejection only) ──
  const commentsBlock =
    !isApproved && comments
      ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="background-color:#fafaf8;border:1px solid #ece9e0;
                    border-radius:8px;margin-bottom:20px;">
        <tr>
          <td style="padding:14px 18px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:${B.muted};
                      text-transform:uppercase;letter-spacing:0.07em;">Feedback from our team</p>
            <p style="margin:0;font-size:13px;color:${B.textPrimary};line-height:1.6;">${comments}</p>
          </td>
        </tr>
      </table>`
      : "";

  // ── CTA button ──
  const ctaButton = isApproved
    ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
        <tr>
          <td align="center">
            <a href="#" style="display:inline-block;padding:14px 32px;
                               background:linear-gradient(135deg,${B.gold} 0%,${B.primary} 100%);
                               color:${B.brownDark};font-size:14px;font-weight:700;
                               border-radius:10px;text-decoration:none;
                               box-shadow:0 4px 14px rgba(255,215,122,0.45);">
              Open your dashboard &rarr;
            </a>
          </td>
        </tr>
      </table>`
    : `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
        <tr>
          <td align="center">
            <a href="${publicBaseUrl}/onboarding?resubmit=${encodeURIComponent(to)}" style="display:inline-block;padding:14px 32px;
                               background:linear-gradient(135deg,${B.coral} 0%,#ff3355 100%);
                               color:#ffffff;font-size:14px;font-weight:700;
                               border-radius:10px;text-decoration:none;
                               box-shadow:0 4px 14px rgba(255,82,105,0.35);">
              Resubmit your application &rarr;
            </a>
          </td>
        </tr>
      </table>`;

  // ── Next steps (approved only) ──
  const nextSteps = isApproved
    ? `${divider}
       ${stepRow("1", "Set up your queue", "Configure your service types, capacity, and operating hours")}
       ${stepRow("2", "Invite your team", "Add staff members to help manage your customer flow")}
       ${stepRow("3", "Go live", "Share your Qios link and start serving customers today")}`
    : "";

  const html = emailWrapper(`
    ${brandHeader({
      title: isApproved
        ? "Your business is officially verified"
        : "Action required on your application",
      subtitle: isApproved
        ? "Welcome to the Qios merchant network"
        : "Your verification requires attention before proceeding",
      pillLabel: isApproved ? "Verification Complete" : "Action Required",
      pillBg: isApproved ? B.greenSoft : B.coralSoft,
      pillBorder: isApproved ? "#a3e8c6" : "#ffb3bd",
      pillColor: isApproved ? "#0a5c34" : "#9b1c33",
    })}

    <tr>
      <td style="padding:32px 40px 28px;background:#fffdf8;">
        <p style="margin:0 0 20px;font-size:15px;color:${B.textPrimary};">
          ${isApproved ? "<strong>Congratulations!</strong>" : "Hi there,"}
        </p>
        <p style="margin:0 0 20px;font-size:14px;color:${B.textSecondary};line-height:1.7;">
          ${
            isApproved
              ? "You now have full access to your merchant dashboard &mdash; manage your queue, serve customers, and track your performance in real time."
              : "Thank you for submitting your business verification documents. After reviewing your application, we were unable to approve it at this time."
          }
        </p>

        ${statusBanner}
        ${commentsBlock}
        ${ctaButton}
        ${nextSteps}

        ${
          !isApproved
            ? `<p style="margin:0;font-size:13px;color:#b8a898;line-height:1.6;">
          If you believe this decision is incorrect or need clarification, our support team is here to help at
          <a href="mailto:support@qios.app" style="color:${B.coral};text-decoration:none;font-weight:600;">support@qios.app</a>.
        </p>`
            : ""
        }
      </td>
    </tr>

    ${emailFooter(`Questions? Reach out at <a href="mailto:support@qios.app" style="color:${B.coral};text-decoration:none;font-weight:600;">support@qios.app</a> &mdash; <strong style="color:${B.goldMid};">Qios</strong>`)}
  `);

  const transporter = createTransporter(smtp);
  try {
    const info = await transporter.sendMail({
      from: smtp.from,
      to,
      subject,
      html,
    });
    return { success: true as const, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending business verification email:", error);
    return {
      success: false as const,
      reason: "SMTP_SEND_FAILED" as const,
      error,
    };
  }
};

// ─── 3. Registration Success Email ────────────────────────────────────────────

export const sendRegistrationSuccessEmail = async ({
  to,
  adminName,
  businessName,
}: {
  to: string;
  adminName: string;
  businessName: string;
}) => {
  const smtp = readSmtpConfig();
  if (!smtp) {
    return {
      success: false,
      reason: "SMTP_NOT_CONFIGURED" as const,
      error: new Error("SMTP is not fully configured."),
    };
  }

  const html = emailWrapper(`
    ${brandHeader({
      title: `Thanks for joining Qios!`,
      subtitle: "Your registration has been received and is under review",
      pillLabel: "Registration Submitted",
      pillBg: B.goldSoft,
      pillBorder: B.border,
      pillColor: B.goldDark,
    })}

    <tr>
      <td style="padding:32px 40px 28px;background:#fffdf8;">
        <p style="margin:0 0 10px;font-size:15px;color:${B.textPrimary};">
          Hi <strong>${adminName}</strong>,
        </p>
        <p style="margin:0 0 24px;font-size:14px;color:${B.textSecondary};line-height:1.7;">
          We've received your registration for <strong>${businessName}</strong> and our team will review your documents shortly.
          Here's what to expect next:
        </p>

        ${stepRow("1", "Document review", "Our team will verify your submitted business documents and information.")}
        ${stepRow("2", "Email notification", "You'll receive an update within <strong>2&ndash;3 business days</strong>.")}
        ${stepRow("3", "Get started", "Once approved, you'll have instant access to your full dashboard.")}

        <!-- Callout box -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="background:linear-gradient(145deg,${B.goldSoft} 0%,#fff8e6 100%);
                      border:1.5px solid ${B.gold};border-radius:12px;margin:20px 0;
                      box-shadow:0 2px 12px rgba(255,215,122,0.20);">
          <tr>
            <td style="padding:16px 20px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="vertical-align:top;font-size:18px;padding-right:12px;">&#x23F3;</td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:13px;color:${B.brownDark};line-height:1.6;">
                      Typical review time is <strong style="color:${B.goldDark};">2&ndash;3 business days</strong>.
                      We'll email you immediately once a decision is made or if we need any additional documents.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin:0;font-size:13px;color:#b8a898;line-height:1.6;">
          In the meantime, feel free to reach out to our support team at
          <a href="mailto:support@qios.app" style="color:${B.coral};text-decoration:none;font-weight:600;">support@qios.app</a>
          if you have any questions about your application.
        </p>
      </td>
    </tr>

    ${emailFooter(`Application submitted for <strong style="color:${B.textPrimary};">${businessName}</strong> &mdash; <strong style="color:${B.goldMid};">Qios</strong>`)}
  `);

  const transporter = createTransporter(smtp);
  try {
    const info = await transporter.sendMail({
      from: smtp.from,
      to,
      subject: "Registration Submitted — Qios",
      html,
    });
    return { success: true as const, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending registration success email:", error);
    return {
      success: false as const,
      reason: "SMTP_SEND_FAILED" as const,
      error,
    };
  }
};
