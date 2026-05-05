"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Send,
  Building2,
  User,
  MessageSquare,
  Tag,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

/* ─── Reusable field label ─────────────────────────────────── */
function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block b4 font-semibold text-text-secondary uppercase tracking-[0.08em] mb-1.5"
    >
      {children}
    </label>
  );
}

/* ─── Reusable text input ─────────────────────────────────── */
function TextInput({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  prefix,
  required,
  className,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full rounded-xl border bg-white/70 backdrop-blur-sm px-4 py-3 transition-all duration-300",
        focused
          ? "border-brand-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand-primary)_18%,transparent)]"
          : "border-black/10 hover:border-brand-primary/40",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "shrink-0 transition-colors duration-300",
            focused ? "text-brand-primary" : "text-text-secondary/50",
          )}
        >
          {icon}
        </span>
      )}
      {prefix && (
        <span className="shrink-0 b2 text-text-secondary/60 pr-1 border-r border-black/10 mr-1 select-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent outline-none b2 text-text-primary placeholder:text-text-secondary/40 min-w-0"
      />
    </div>
  );
}

/* ─── Reusable textarea ────────────────────────────────────── */
function TextArea({
  id,
  placeholder,
  value,
  onChange,
  rows = 5,
}: {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "w-full rounded-xl border bg-white/70 backdrop-blur-sm px-4 py-3 transition-all duration-300",
        focused
          ? "border-brand-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand-primary)_18%,transparent)]"
          : "border-black/10 hover:border-brand-primary/40",
      )}
    >
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent outline-none resize-none b2 text-text-primary placeholder:text-text-secondary/40"
      />
    </div>
  );
}

/* ─── Contact method pill ──────────────────────────────────── */
function ContactMethodPill({
  id,
  icon,
  label,
  description,
  selected,
  onSelect,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onSelect}
      className={cn(
        "flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-300 group",
        selected
          ? "border-brand-primary bg-brand-primary/8 shadow-[0_4px_18px_color-mix(in_srgb,var(--color-brand-primary)_22%,transparent)]"
          : "border-black/10 bg-white/60 backdrop-blur-sm hover:border-brand-primary/40 hover:bg-white/80",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
          selected
            ? "bg-brand-primary text-white shadow-md"
            : "bg-black/5 text-text-secondary group-hover:bg-brand-primary/10 group-hover:text-brand-primary",
        )}
      >
        {icon}
      </div>
      <div>
        <p
          className={cn(
            "b3 transition-colors duration-300",
            selected ? "text-brand-primary" : "text-text-primary",
          )}
        >
          {label}
        </p>
        <p className="b5 text-text-secondary mt-0.5">{description}</p>
      </div>
      {selected && (
        <CheckCircle
          size={18}
          className="text-brand-primary ml-auto shrink-0"
          fill="currentColor"
        />
      )}
    </button>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    contactMethod: "email" as "email" | "phone",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const gradientHeaderStyle = {
    background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      className="relative w-full py-32 px-6 bg-bg-primary overflow-hidden"
      id="contact-form"
    >
      {/* ── Background blobs (matching SubscriptionPlans) ── */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-10" />
      <div
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FFD77A 0%, transparent 70%)",
          filter: "blur(110px)",
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-35 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FF5269 0%, transparent 70%)",
          filter: "blur(130px)",
        }}
      />
      <div
        className="absolute top-1/4 right-[5%] w-[40%] h-[50%] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #ffc670 0%, transparent 60%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ── Section header ── */}
        <div className="text-center mb-14 space-y-3">
          <p className="b3 text-brand-primary">GET IN TOUCH</p>
          <h1
            className="max-md:text-[34px] h1 text-text-primary tracking-tight leading-tight"
          >
            We&apos;d love to{" "}
            <span style={gradientHeaderStyle}>hear from you.</span>
          </h1>
          <p className="max-md:text-base h4 text-text-secondary max-w-[520px] mx-auto">
            Whether you have a question, want a demo, or just want to say hello—our team is ready.
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-brand-primary/20 shadow-xl shadow-brand-primary/5 overflow-hidden"
        >
          {/* Card header bar */}
          <div className="bg-brand-primary/25 px-8 py-7 flex items-center gap-4 border-b border-black/5">
            <div className="w-11 h-11 rounded-2xl bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/30 shrink-0">
              <MessageSquare
                className="w-5 h-5 text-white"
                fill="currentColor"
              />
            </div>
            <div>
              <h2 className="text-[22px] leading-[125%] font-bold font-figtree text-text-primary">
                Contact Us
              </h2>
              <p className="b4 text-text-secondary hidden md:block">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>
            </div>
          </div>

          {/* ── Success state ── */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-6 py-20 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success-secondary flex items-center justify-center">
                <CheckCircle
                  size={40}
                  className="text-success-primary"
                  fill="currentColor"
                />
              </div>
              <div className="space-y-2">
                <h3 className="h3 text-text-primary font-figtree font-bold">
                  Message sent!
                </h3>
                <p className="b1 text-text-secondary max-w-sm">
                  Thanks, <strong>{form.name.split(" ")[0]}</strong>! We&apos;ll
                  reach out via{" "}
                  <strong>
                    {form.contactMethod === "email" ? form.email : `+63 ${form.phone}`}
                  </strong>{" "}
                  soon.
                </p>
              </div>
              <Button
                variant="outline"
                shape="rounded"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    subject: "",
                    message: "",
                    contactMethod: "email",
                  });
                }}
                className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary"
              >
                Send another message
              </Button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel htmlFor="contact-name">Full Name *</FieldLabel>
                  <TextInput
                    id="contact-name"
                    placeholder="Juan dela Cruz"
                    value={form.name}
                    onChange={set("name")}
                    icon={<User size={16} />}
                    required
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="contact-email">
                    Email Address *
                  </FieldLabel>
                  <TextInput
                    id="contact-email"
                    type="email"
                    placeholder="juan@company.com"
                    value={form.email}
                    onChange={set("email")}
                    icon={<Mail size={16} />}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone + Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel htmlFor="contact-phone">Phone Number</FieldLabel>
                  <TextInput
                    id="contact-phone"
                    type="tel"
                    placeholder="9XX XXX XXXX"
                    value={form.phone}
                    onChange={set("phone")}
                    icon={<Phone size={16} />}
                    prefix="+63"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="contact-company">
                    Company / Restaurant
                  </FieldLabel>
                  <TextInput
                    id="contact-company"
                    placeholder="Jollibee Cebu Branch"
                    value={form.company}
                    onChange={set("company")}
                    icon={<Building2 size={16} />}
                  />
                </div>
              </div>

              {/* Row 3: Subject */}
              <div>
                <FieldLabel htmlFor="contact-subject">Subject *</FieldLabel>
                <TextInput
                  id="contact-subject"
                  placeholder="e.g. Demo request, Pricing inquiry…"
                  value={form.subject}
                  onChange={set("subject")}
                  icon={<Tag size={16} />}
                  required
                />
              </div>

              {/* Row 4: Message */}
              <div>
                <FieldLabel htmlFor="contact-message">Message *</FieldLabel>
                <TextArea
                  id="contact-message"
                  placeholder="Tell us a bit about your business and what you're looking for…"
                  value={form.message}
                  onChange={set("message")}
                  rows={5}
                />
              </div>

              {/* ── Preferred contact method ── */}
              <div>
                <p className="b4 font-semibold text-text-secondary uppercase tracking-[0.08em] mb-3">
                  Preferred Contact Method
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <ContactMethodPill
                    id="method-email"
                    icon={<Mail size={18} />}
                    label="Email"
                    description="We'll reply to your inbox"
                    selected={form.contactMethod === "email"}
                    onSelect={() =>
                      setForm((p) => ({ ...p, contactMethod: "email" }))
                    }
                  />
                  <ContactMethodPill
                    id="method-phone"
                    icon={<Phone size={18} />}
                    label="Phone / SMS"
                    description="We'll call or text your number"
                    selected={form.contactMethod === "phone"}
                    onSelect={() =>
                      setForm((p) => ({ ...p, contactMethod: "phone" }))
                    }
                  />
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="h-px w-full bg-black/6" />

              {/* ── Submit ── */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="b4 text-text-secondary/70">
                  * Required fields. We typically respond within{" "}
                  <span className="text-brand-primary font-semibold">
                    1 business day
                  </span>
                  .
                </p>
                <Button
                  type="submit"
                  variant="accent"
                  shape="rounded"
                  size="md"
                  loading={loading}
                  rightIcon={!loading ? <Send size={16} /> : undefined}
                  className="shrink-0 w-full sm:w-auto"
                >
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* ── Info tiles below the card ── */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: <Mail size={20} className="text-brand-primary" />,
              label: "Email",
              value: "hello@qios.ph",
            },
            {
              icon: <Phone size={20} className="text-brand-accent" />,
              label: "Phone",
              value: "+63 32 000 0000",
            },
            {
              icon: <Building2 size={20} className="text-success-primary" />,
              label: "Office",
              value: "Cebu City, Philippines",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-black/8 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-black/4 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="b5 font-semibold uppercase tracking-[0.08em] text-text-secondary/60">
                  {item.label}
                </p>
                <p className="b2 text-text-primary mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-0" />
    </section>
  );
}
