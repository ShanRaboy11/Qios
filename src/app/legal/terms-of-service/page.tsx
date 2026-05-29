"use client";

import React from "react";
import { LegalDocument } from "@/components/templates/LegalDocument";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "services", title: "2. Description of Services" },
  { id: "accounts", title: "3. Account Registration" },
  { id: "billing", title: "4. Billing & Subscriptions" },
  { id: "tenant-responsibilities", title: "5. Tenant Responsibilities" },
  { id: "intellectual-property", title: "6. Intellectual Property" },
  { id: "limitation-liability", title: "7. Limitation of Liability" },
  { id: "termination", title: "8. Termination" },
];

export default function TermsOfService() {
  return (
    <LegalDocument
      title="Terms of Service"
      lastUpdated="May 29, 2026"
      sections={sections}
    >
      <section id="acceptance" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          1. Acceptance of Terms
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          By accessing or using the Qios platform ("Services"), you agree to be
          bound by these Terms of Service ("Terms"). If you disagree with any
          part of the terms, you may not access the Services. These Terms apply
          to all visitors, users, tenants, and others who access or use the
          Services.
        </p>
      </section>

      <section id="services" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          2. Description of Services
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Qios is a multi-tenant SaaS platform that provides Food & Beverage
          (F&B) establishments with digital menus, inventory management, order
          processing, and analytics tools. We reserve the right to modify,
          suspend, or discontinue the Services at any time, with or without
          notice.
        </p>
      </section>

      <section id="accounts" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          3. Account Registration & Security
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          To use our Services, you must register for an account. You must
          provide accurate, complete, and current information. You are
          responsible for safeguarding the password that you use to access the
          Services and for any activities or actions under your password.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          You agree not to disclose your password to any third party. You must
          notify us immediately upon becoming aware of any breach of security or
          unauthorized use of your account.
        </p>
      </section>

      <section id="billing" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          4. Billing, Subscriptions, and Refunds
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          <strong className="text-text-primary">Subscriptions:</strong> Qios is
          billed on a subscription basis. You will be billed in advance on a
          recurring and periodic basis (e.g., monthly or annually), depending on
          the type of subscription plan you select.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          <strong className="text-text-primary">Payment Processing:</strong> All
          payments are processed securely via our third-party payment processor,
          Stripe. We do not store your full credit card details.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          <strong className="text-text-primary">
            Cancellations and Refunds:
          </strong>{" "}
          You may cancel your subscription at any time. Cancellations will take
          effect at the end of the current billing cycle. Payments are
          non-refundable, and there are no refunds or credits for partially used
          periods unless legally required.
        </p>
      </section>

      <section id="tenant-responsibilities" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          5. Tenant Responsibilities
        </h2>
        <p className="text-text-secondary leading-relaxed mb-3">
          As a Tenant using Qios to manage your F&B business, you agree to:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>
            Comply with all applicable local, state, and national laws regarding
            the sale of food and beverages.
          </li>
          <li>
            Accurately represent your products, prices, and allergens on your
            digital menu.
          </li>
          <li>
            Handle your customers' personal data in compliance with applicable
            privacy laws.
          </li>
          <li>Abide by our Acceptable Use Policy.</li>
        </ul>
      </section>

      <section id="intellectual-property" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          6. Intellectual Property
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          The Services and their original content, features, and functionality
          are and will remain the exclusive property of Qios and its licensors.
          Our trademarks and trade dress may not be used in connection with any
          product or service without the prior written consent of Qios.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          You retain all rights to the content you upload to the platform (e.g.,
          your logos, menu item photos). By uploading content, you grant Qios a
          license to use, display, and distribute such content solely for the
          purpose of providing the Services.
        </p>
      </section>

      <section id="limitation-liability" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          7. Limitation of Liability
        </h2>
        <p className="text-text-secondary leading-relaxed mb-3">
          In no event shall Qios, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from:
        </p>
        <ul className="list-disc list-outside ml-5 text-text-secondary space-y-2 leading-relaxed mb-4">
          <li>
            Your access to or use of or inability to access or use the Services;
          </li>
          <li>Any conduct or content of any third party on the Services;</li>
          <li>
            Unauthorized access, use, or alteration of your transmissions or
            content.
          </li>
        </ul>
      </section>

      <section id="termination" className="mb-14">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
          8. Termination
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          We may terminate or suspend your account immediately, without prior
          notice or liability, for any reason whatsoever, including without
          limitation if you breach the Terms. Upon termination, your right to
          use the Services will immediately cease.
        </p>
      </section>
    </LegalDocument>
  );
}
