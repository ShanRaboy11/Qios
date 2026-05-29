"use client";

import React from "react";
import { LegalDocument } from "@/components/templates/LegalDocument";

const sections = [
  { id: "what-are-cookies", title: "1. What Are Cookies" },
  { id: "how-we-use", title: "2. How We Use Cookies" },
  { id: "types-of-cookies", title: "3. Types of Cookies We Use" },
  { id: "your-choices", title: "4. Your Cookie Choices" },
  { id: "updates", title: "5. Updates to This Policy" },
];

export default function CookiePolicy() {
  return (
    <LegalDocument 
      title="Cookie Policy" 
      lastUpdated="May 29, 2026" 
      sections={sections}
    >
      <section id="what-are-cookies">
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
        </p>
      </section>

      <section id="how-we-use">
        <h2>2. How We Use Cookies</h2>
        <p>
          Qios uses cookies and similar tracking technologies to track the activity on our Services and hold certain information. We use these technologies to:
        </p>
        <ul>
          <li>Authenticate users and prevent fraudulent use of user accounts.</li>
          <li>Maintain your session state across different pages of the platform.</li>
          <li>Understand and save your preferences for future visits.</li>
          <li>Compile aggregate data about site traffic and site interactions.</li>
        </ul>
      </section>

      <section id="types-of-cookies">
        <h2>3. Types of Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as logging in or filling in forms.
        </p>
        <p>
          <em>Example: Supabase authentication cookies used to keep you securely logged into your Qios dashboard.</em>
        </p>

        <h3>Analytical/Performance Cookies</h3>
        <p>
          These cookies allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.
        </p>

        <h3>Functionality Cookies</h3>
        <p>
          These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences.
        </p>
      </section>

      <section id="your-choices">
        <h2>4. Your Cookie Choices</h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Banner that appears upon your first visit.
        </p>
        <p>
          Additionally, most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">aboutcookies.org</a>.
        </p>
        <p>
          Please note that if you disable essential cookies, certain features of the Qios platform (such as logging in to your dashboard) will not function correctly.
        </p>
      </section>

      <section id="updates">
        <h2>5. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
      </section>
    </LegalDocument>
  );
}
