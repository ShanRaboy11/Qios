"use client";

import React from "react";
import { LegalDocument } from "@/components/templates/LegalDocument";

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "prohibited-content", title: "2. Prohibited Content" },
  { id: "prohibited-activities", title: "3. Prohibited Activities" },
  { id: "system-abuse", title: "4. System Abuse" },
  { id: "enforcement", title: "5. Enforcement" },
];

export default function AcceptableUsePolicy() {
  return (
    <LegalDocument 
      title="Acceptable Use Policy" 
      lastUpdated="May 29, 2026" 
      sections={sections}
    >
      <section id="overview">
        <h2>1. Overview</h2>
        <p>
          This Acceptable Use Policy ("AUP") outlines the acceptable and prohibited uses of the Qios platform and services. By using our services, you agree to comply with this AUP. We reserve the right to modify this policy at any time.
        </p>
      </section>

      <section id="prohibited-content">
        <h2>2. Prohibited Content</h2>
        <p>
          You may not use Qios to upload, post, distribute, or otherwise transmit any content (including menu items, images, and descriptions) that:
        </p>
        <ul>
          <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, or vulgar.</li>
          <li>Infringes on any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
          <li>Promotes illegal activities, including the sale of illegal drugs or regulated substances without proper authorization.</li>
          <li>Contains viruses, trojan horses, worms, or any other malicious code.</li>
          <li>Is fraudulent, deceptive, or misleading.</li>
        </ul>
      </section>

      <section id="prohibited-activities">
        <h2>3. Prohibited Activities</h2>
        <p>
          While using the Qios platform, you agree not to engage in any of the following activities:
        </p>
        <ul>
          <li>Using the service for any illegal purpose or in violation of any local, state, national, or international law.</li>
          <li>Violating, or encouraging others to violate, any right of a third party, including by infringing or misappropriating any third-party intellectual property right.</li>
          <li>Selling, reselling, or leasing the Services without our explicit written consent.</li>
          <li>Attempting to bypass any measures we may use to prevent or restrict access to the Services.</li>
        </ul>
      </section>

      <section id="system-abuse">
        <h2>4. System Abuse</h2>
        <p>
          You must not abuse the Qios system infrastructure. Prohibited system abuse includes:
        </p>
        <ul>
          <li>Using automated scripts, bots, or scrapers to access, copy, or manipulate data on the platform.</li>
          <li>Imposing an unreasonable or disproportionately large load on our infrastructure (e.g., automated high-frequency API calls).</li>
          <li>Interfering with or disrupting the integrity or performance of the Services or related data.</li>
          <li>Attempting to gain unauthorized access to the Services, related systems, or networks.</li>
        </ul>
      </section>

      <section id="enforcement">
        <h2>5. Enforcement</h2>
        <p>
          We retain the right, but do not have the obligation, to monitor your use of the Services to ensure compliance with this AUP. We reserve the right to investigate any violation of this AUP and to take appropriate action, which may include:
        </p>
        <ul>
          <li>Removing or disabling access to any prohibited content.</li>
          <li>Suspending or terminating your access to the Services.</li>
          <li>Reporting activities to law enforcement authorities when necessary.</li>
        </ul>
      </section>
    </LegalDocument>
  );
}
