"use client";

import React from "react";
import { LegalDocument } from "@/components/templates/LegalDocument";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-collection", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Information" },
  { id: "information-sharing", title: "4. Information Sharing" },
  { id: "data-security", title: "5. Data Security & Retention" },
  { id: "your-rights", title: "6. Your Privacy Rights" },
  { id: "contact-us", title: "7. Contact Us" },
];

export default function PrivacyPolicy() {
  return (
    <LegalDocument
      title="Privacy Policy"
      lastUpdated="May 29, 2026"
      sections={sections}
    >
      <section id="introduction" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          1. Introduction
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Welcome to Qios ("we," "our," or "us"). We respect your privacy and
          are committed to protecting your personal data. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you visit our website, use our SaaS platform, or interact with
          our F&B management services (collectively, the "Services").
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          This policy applies to all users of the Services, including restaurant
          owners/tenants ("Tenants"), their employees ("Employees"), and
          end-customers ("Customers").
        </p>
      </section>

      <section id="information-collection" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          2. Information We Collect
        </h2>

        <h3 className="text-lg font-bold text-text-primary mt-8 mb-2">
          2.1 Tenant and Admin Data
        </h3>
        <p className="text-text-secondary leading-relaxed mb-3">
          When you register for an account as a Tenant, we collect personal and
          business information including:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>Full name and business name</li>
          <li>Email address and phone number</li>
          <li>
            Billing and payment information (processed securely via Stripe)
          </li>
          <li>Store details (address, timezone, currency)</li>
        </ul>

        <h3 className="text-lg font-bold text-text-primary mt-8 mb-2">
          2.2 Employee Data
        </h3>
        <p className="text-text-secondary leading-relaxed mb-3">
          Tenants may create accounts for their employees. We collect:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>Names or usernames</li>
          <li>
            System activity logs and audit trails related to inventory, sales,
            and order management
          </li>
          <li>Assigned roles and permissions</li>
        </ul>

        <h3 className="text-lg font-bold text-text-primary mt-8 mb-2">
          2.3 Customer Data
        </h3>
        <p className="text-text-secondary leading-relaxed mb-3">
          When end-customers use Qios to place orders via QR code or digital
          menus, we may collect:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>Order history and transaction details</li>
          <li>
            Device information (browser type, IP address) necessary for session
            management
          </li>
          <li>
            Contact information (email or phone number) if provided for digital
            receipts or accounts
          </li>
        </ul>
      </section>

      <section id="how-we-use" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          3. How We Use Information
        </h2>
        <p className="text-text-secondary leading-relaxed mb-3">
          We use the collected information for various purposes, including:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>Providing, maintaining, and improving our Services</li>
          <li>Processing payments and managing subscriptions</li>
          <li>Authenticating users and managing account security</li>
          <li>Generating analytics and reporting for Tenants</li>
          <li>
            Communicating with you regarding updates, security alerts, and
            support
          </li>
          <li>Complying with legal obligations</li>
        </ul>
      </section>

      <section id="information-sharing" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          4. Information Sharing and Disclosure
        </h2>
        <p className="text-text-secondary leading-relaxed mb-3">
          We do not sell your personal information. We may share your
          information with third-party service providers who assist us in
          operating our Services:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>
            <strong className="text-text-primary">Supabase:</strong> For
            database hosting, authentication, and secure file storage.
          </li>
          <li>
            <strong className="text-text-primary">Stripe:</strong> For secure
            payment processing and subscription management.
          </li>
        </ul>
        <p className="text-text-secondary leading-relaxed mb-4">
          We may also disclose information if required to do so by law or in
          response to valid requests by public authorities.
        </p>
      </section>

      <section id="data-security" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          5. Data Security & Retention
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          We implement appropriate technical and organizational security
          measures designed to protect the security of any personal information
          we process. However, despite our safeguards, no internet transmission
          is 100% secure.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          We retain personal information only for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy, unless a longer
          retention period is required by law.
        </p>
      </section>

      <section id="your-rights" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          6. Your Privacy Rights
        </h2>
        <p className="text-text-secondary leading-relaxed mb-3">
          Depending on your location, you may have rights regarding your
          personal data, including the right to:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data ("Right to be Forgotten")</li>
          <li>Opt-out of certain data processing activities</li>
        </ul>
        <p className="text-text-secondary leading-relaxed mb-4">
          To exercise these rights, please contact us using the information
          below.
        </p>
      </section>

      <section id="contact-us" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          7. Contact Us
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          If you have questions or comments about this Privacy Policy, please
          contact us at:
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          <strong className="text-text-primary">Email:</strong>{" "}
          <a
            href="mailto:privacy@qios.com"
            className="text-brand-accent hover:underline"
          >
            privacy@qios.com
          </a>
          <br />
          <strong className="text-text-primary">Address:</strong> Cebu City,
          Philippines
        </p>
      </section>
    </LegalDocument>
  );
}
