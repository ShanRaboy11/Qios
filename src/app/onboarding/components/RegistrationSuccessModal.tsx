"use client";

import React from "react";
import { CheckCircle2, Mail, Clock, Home } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

interface RegistrationSuccessModalProps {
  adminName: string;
  adminEmail: string;
  onClose: () => void;
}

export function RegistrationSuccessModal({
  adminName,
  adminEmail,
  onClose,
}: RegistrationSuccessModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Registration Successful!
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          Thank you, <span className="font-semibold">{adminName}</span>. Your
          registration has been successfully submitted.
        </p>

        {/* Info Card 1: Email Sent */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Confirmation Email Sent
              </p>
              <p className="text-xs text-blue-700 mt-1">
                A detailed confirmation has been sent to {adminEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Info Card 2: Verification Timeline */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Verification Timeline
              </p>
              <ul className="text-xs text-amber-700 mt-2 space-y-1">
                <li>• Our team will review your documents</li>
                <li>
                  • <strong>2-3 business days</strong> for verification
                </li>
                <li>• You'll receive an email when approved</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-sm text-gray-600 mb-6">
          We'll notify you via email as soon as your registration is approved or
          if we need any additional information.{" "}
          <span className="font-medium text-gray-800">
            You will receive a link to set up your store's branding once verified.
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              onClose();
              router.push("/");
            }}
          >
            <Home size={18} />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
