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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

// ── validation helpers ────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v: string) => /^9\d{9}$/.test(v.replace(/\s/g, ""));

type Errors = Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>;

// ── reusable field label ──────────────────────────────────────
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

// ── reusable text input ───────────────────────────────────────
function TextInput({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  prefix,
  error,
  className,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  error?: string;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex items-center gap-2 w-full rounded-xl border bg-white/70 backdrop-blur-sm px-4 py-3 transition-all duration-300",
          error
            ? "border-warning-primary bg-warning-secondary/30 shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-warning-primary)_15%,transparent)]"
            : focused
              ? "border-brand-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand-primary)_18%,transparent)]"
              : "border-black/10 hover:border-brand-primary/40",
          className,
        )}
      >
        {icon && (
          <span
            className={cn(
              "shrink-0 transition-colors duration-300",
              error
                ? "text-warning-primary"
                : focused
                  ? "text-brand-primary"
                  : "text-text-secondary/50",
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
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none b2 text-text-primary placeholder:text-text-secondary/40 min-w-0"
        />
        {error && <AlertCircle size={16} className="shrink-0 text-warning-primary" />}
      </div>
      {error && (
        <p className="b5 text-warning-primary font-medium pl-1">{error}</p>
      )}
    </div>
  );
}

// ── reusable textarea ─────────────────────────────────────────
function TextArea({
  id,
  placeholder,
  value,
  onChange,
  rows = 5,
  error,
}: {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "w-full rounded-xl border bg-white/70 backdrop-blur-sm px-4 py-3 transition-all duration-300",
          error
            ? "border-warning-primary bg-warning-secondary/30 shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-warning-primary)_15%,transparent)]"
            : focused
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
      {error && (
        <p className="b5 text-warning-primary font-medium pl-1 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

// ── contact method pill ───────────────────────────────────────
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
        "flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-300 group backdrop-blur-sm",
        selected
          ? "border-brand-primary bg-brand-primary/8 shadow-lg shadow-brand-primary/20"
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
        {selected && (
        <div className="absolute inset-0 bg-brand-primary/5 rounded-[14px] pointer-events-none" />
      )}
        {icon}
      </div>
      <div className="flex-1 min-w-0">
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
    </button>
  );
}

// ── main component ────────────────────────────────────────────
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
  const [errors, setErrors] = useState<Errors>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const gradientHeaderStyle = {
    background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const set = (key: keyof typeof form) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    // clear error on change
    if (errors[key as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (form.phone && !isValidPhone(form.phone)) {
      newErrors.phone = "Enter a valid PH mobile number (e.g. 9171234567).";
    }
    if (form.contactMethod === "phone" && !form.phone.trim()) {
      newErrors.phone = "Phone number is required when using phone contact.";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required.";
    if (!form.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // simulate network request
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setShowModal(true);
  };

  const handleReset = () => {
    setShowModal(false);
    setErrors({});
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      contactMethod: "email",
    });
  };

  return (
    <section
      className="relative w-full py-32 px-6 bg-bg-primary overflow-hidden"
      id="contact-form"
    >
      {/* background blobs (matching subscription plans) */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-10" />
      <div
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #FFD77A 0%, transparent 70%)",
          filter: "blur(110px)",
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #FF5269 0%, transparent 70%)",
          filter: "blur(130px)",
        }}
      />
      <div
        className="absolute top-1/4 right-[5%] w-[40%] h-[50%] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #ffc670 0%, transparent 60%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* section header */}
        <div className="text-center mb-14 space-y-3">
          <p className="b3 text-brand-primary">GET IN TOUCH</p>
          <h1 className="max-md:text-[34px] h1 text-text-primary tracking-tight leading-tight">
            We&apos;d love to{" "}
            <span style={gradientHeaderStyle}>hear from you.</span>
          </h1>
          <p className="max-md:text-base h4 text-text-secondary max-w-[520px] mx-auto">
            Whether you have a question, want a demo, or just want to say hello — our team is ready.
          </p>
        </div>

        {/* success modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 flex flex-col items-center text-center gap-6 animate-in zoom-in-95 fade-in duration-200">
              {/* success icon */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-success-secondary/60 animate-ping" style={{ animationDuration: "1.8s" }} />
                <div className="relative w-20 h-20 rounded-full bg-success-secondary flex items-center justify-center shadow-lg shadow-success-primary/20">
                  <svg
                    viewBox="0 0 24 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-success-primary"
                  >
                    <path d="M2 10l7 7L22 2" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="h3 text-text-primary font-figtree font-bold">Message sent!</h3>
                <p className="b1 text-text-secondary max-w-sm">
                  Thanks, <strong>{form.name.split(" ")[0]}</strong>! We&apos;ll reach out via{" "}
                  <strong>
                    {form.contactMethod === "email" ? form.email : `+63 ${form.phone}`}
                  </strong>{" "}
                  soon.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  shape="rounded"
                  onClick={handleReset}
                  className="flex-1 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary"
                >
                  Send another
                </Button>
                <Button
                  variant="accent"
                  shape="rounded"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-brand-primary/20 shadow-xl shadow-brand-primary/5 overflow-hidden">
          {/* card header bar */}
          <div className="bg-brand-primary/25 px-8 py-7 flex items-center gap-4 border-b border-black/5">
            <div className="w-11 h-11 rounded-2xl bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/30 shrink-0">
              <MessageSquare className="w-5 h-5 text-white" fill="currentColor" />
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

          {/* form — always visible */}
          <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
              {/* row 1: name + email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel htmlFor="contact-name">Full Name *</FieldLabel>
                  <TextInput
                    id="contact-name"
                    placeholder="Juan dela Cruz"
                    value={form.name}
                    onChange={set("name")}
                    icon={<User size={16} />}
                    error={errors.name}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="contact-email">Email Address *</FieldLabel>
                  <TextInput
                    id="contact-email"
                    type="email"
                    placeholder="juan@company.com"
                    value={form.email}
                    onChange={set("email")}
                    icon={<Mail size={16} />}
                    error={errors.email}
                  />
                </div>
              </div>

              {/* row 2: phone + company */}
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
                    error={errors.phone}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="contact-company">Company / Restaurant</FieldLabel>
                  <TextInput
                    id="contact-company"
                    placeholder="Jollibee Cebu Branch"
                    value={form.company}
                    onChange={set("company")}
                    icon={<Building2 size={16} />}
                  />
                </div>
              </div>

              {/* row 3: subject */}
              <div>
                <FieldLabel htmlFor="contact-subject">Subject *</FieldLabel>
                <TextInput
                  id="contact-subject"
                  placeholder="e.g. Demo request, Pricing inquiry…"
                  value={form.subject}
                  onChange={set("subject")}
                  icon={<Tag size={16} />}
                  error={errors.subject}
                />
              </div>

              {/* row 4: message */}
              <div>
                <FieldLabel htmlFor="contact-message">Message *</FieldLabel>
                <TextArea
                  id="contact-message"
                  placeholder="Tell us a bit about your business and what you're looking for…"
                  value={form.message}
                  onChange={set("message")}
                  rows={5}
                  error={errors.message}
                />
              </div>

              {/* preferred contact method */}
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
                    onSelect={() => setForm((p) => ({ ...p, contactMethod: "email" }))}
                  />
                  <ContactMethodPill
                    id="method-phone"
                    icon={<Phone size={18} />}
                    label="Phone / SMS"
                    description="We'll call or text your number"
                    selected={form.contactMethod === "phone"}
                    onSelect={() => setForm((p) => ({ ...p, contactMethod: "phone" }))}
                  />
                </div>
              </div>

              {/* divider */}
              <div className="h-px w-full bg-black/6" />

              {/* submit row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="b4 text-text-secondary/70">
                  * Required fields. We typically respond within{" "}
                  <span className="text-brand-primary font-semibold">1 business day</span>.
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
        </div>

        {/* info tiles */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: <Mail size={20} className="text-brand-primary" />, label: "Email", value: "contact@qios.ph" },
            { icon: <Phone size={20} className="text-brand-accent" />, label: "Phone", value: "+63 912 345 6789" },
            { icon: <Building2 size={20} className="text-success-primary" />, label: "Office", value: "Cebu City, Philippines" },
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
