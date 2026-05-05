"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  actionType: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "REFUND";
  target: string;
  ip: string;
  details: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    message?: string;
  };
}

interface AuditLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLogEntry | null;
}

export const AuditLogDetailsModal = ({ isOpen, onClose, log }: AuditLogDetailsModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && log && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />
          <div className="fixed inset-0 z-[160] flex items-center justify-center pointer-events-none p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto"
            >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="font-bold text-xl text-text-primary">Audit Log Details</h3>
                <p className="text-sm text-text-secondary mt-1">Log ID: {log.id}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-text-primary hover:bg-gray-50 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-xs font-bold text-text-secondary uppercase mb-1">Actor</span>
                  <span className="block font-medium text-text-primary">{log.actor}</span>
                  <span className="block text-sm text-text-tertiary">{log.role}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-xs font-bold text-text-secondary uppercase mb-1">Timestamp</span>
                  <span className="block font-medium text-text-primary">{log.timestamp}</span>
                  <span className="block text-sm text-text-tertiary">IP: {log.ip}</span>
                </div>
              </div>

              {/* Action Info */}
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-3">Action Summary</h4>
                <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 flex items-start gap-4">
                  <Badge
                    color={
                      log.actionType === "DELETE" || log.actionType === "REFUND" ? "error" :
                      log.actionType === "UPDATE" ? "warning" :
                      log.actionType === "CREATE" ? "success" : "info"
                    }
                    variant="solid"
                    className="mt-0.5"
                  >
                    {log.actionType}
                  </Badge>
                  <div>
                    <span className="block font-medium text-text-primary">{log.action}</span>
                    <span className="block text-sm text-text-secondary mt-1">Target: {log.target}</span>
                  </div>
                </div>
              </div>

              {/* Diff View */}
              {(log.details.before || log.details.after) && (
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-3">Data Changes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {log.details.before && (
                      <div className="border border-error-primary/20 rounded-xl overflow-hidden">
                        <div className="bg-error-secondary/30 px-4 py-2 border-b border-error-primary/20">
                          <span className="text-xs font-bold text-error-primary uppercase">Before</span>
                        </div>
                        <pre className="p-4 text-sm text-text-secondary bg-gray-50 overflow-x-auto">
                          {JSON.stringify(log.details.before, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.details.after && (
                      <div className="border border-success-primary/20 rounded-xl overflow-hidden">
                        <div className="bg-success-secondary/30 px-4 py-2 border-b border-success-primary/20">
                          <span className="text-xs font-bold text-success-primary uppercase">After</span>
                        </div>
                        <pre className="p-4 text-sm text-text-secondary bg-gray-50 overflow-x-auto">
                          {JSON.stringify(log.details.after, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {log.details.message && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-xs font-bold text-text-secondary uppercase mb-1">Additional Message</span>
                  <span className="block text-sm text-text-primary">{log.details.message}</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <Button variant="outline" shape="rounded" onClick={onClose}>
                Close Details
              </Button>
            </div>
          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
