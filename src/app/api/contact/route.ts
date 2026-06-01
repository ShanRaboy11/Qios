import { NextRequest, NextResponse } from "next/server";
import { sendContactSubmissionEmails } from "@/lib/contactEmail";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string) {
  return /^9\d{9}$/.test(value.replace(/\s/g, ""));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const company =
      typeof body?.company === "string" ? body.company.trim() : "";
    const subject =
      typeof body?.subject === "string" ? body.subject.trim() : "";
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    const contactMethod = body?.contactMethod === "phone" ? "phone" : "email";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid PH mobile number." },
        { status: 400 },
      );
    }

    if (contactMethod === "phone" && !phone) {
      return NextResponse.json(
        { error: "Phone number is required when phone contact is selected." },
        { status: 400 },
      );
    }

    const result = await sendContactSubmissionEmails({
      name,
      email,
      phone,
      company,
      subject,
      message,
    });

    if (!result.success) {
      const message =
        result.reason === "SMTP_NOT_CONFIGURED"
          ? "Our contact email service is not configured yet. Please notify support."
          : "We hit an email delivery issue. Please try again in a few minutes.";

      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
