import type { LucideIcon } from "lucide-react";
import { FileText, Landmark, Receipt, ShieldCheck } from "lucide-react";

export type DocumentRequirement = {
  id: string;
  title: string;
  desc: string;
  required: boolean;
  icon: LucideIcon;
};

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    id: "dti_sec",
    title: "DTI or SEC Registration",
    desc: "Sole proprietor or Corporation registration.",
    required: true,
    icon: Landmark,
  },
  {
    id: "permit",
    title: "Mayor’s Permit",
    desc: "Includes local LGU and Barangay permits.",
    required: true,
    icon: ShieldCheck,
  },
  {
    id: "sanitary",
    title: "Sanitary Permit",
    desc: "Health certificates from your local LGU.",
    required: true,
    icon: FileText,
  },
  {
    id: "bir",
    title: "BIR Registration",
    desc: "TIN and Official Receipt compliance.",
    required: true,
    icon: Receipt,
  },
  {
    id: "fda",
    title: "FDA Licensing",
    desc: "For pre-packaged or manufactured food.",
    required: false,
    icon: FileText,
  },
];

export const DOCUMENT_REQUIREMENT_IDS = DOCUMENT_REQUIREMENTS.map((requirement) => requirement.id);