const fs = require('fs');
let c = fs.readFileSync('src/app/(customer)/home/page.tsx', 'utf8');

const MOCK_BRANDING_STR = `const MOCK_BRANDING = {
  primaryColor: "#00704A",
  secondaryColor: "#D4E9E2",
  accentColor: "#1E3932",
  fontFamily: "playfair",
  secondaryFont: "inter",
  menuLayout: "grid",
  dashboardLogoUrl: "/images/starbucks-logo.png",
};

export default function CustomerHomePage() {
  const isGridView = MOCK_BRANDING.menuLayout === "grid";`;

c = c.replace('export default function CustomerHomePage() {', MOCK_BRANDING_STR);

// replace branding={{...} as any} with branding={MOCK_BRANDING as any}
const regex = /branding=\{\{[\s\S]*?\} as any\}/;
c = c.replace(regex, 'branding={MOCK_BRANDING as any}');

// replace bg-[#FF5269]/50
c = c.replace(/bg-\[#FF5269\]\/50/g, 'bg-brand-accent/50');

// add dynamic classes
c = c.replace(/className="col-span-2 md:col-span-3 lg:col-span-4 flex justify-center"/g, ""); // clear if exists
const dynamicClass = `className={!isGridView ? "col-span-2 md:col-span-3 lg:col-span-4 flex justify-center" : ""}`;
c = c.replace(/variants=\{\{\n\s*hidden: \{ opacity: 0, y: 20 \},\n\s*show: \{ opacity: 1, y: 0 \},\n\s*\}\}\n\s*>/g, 
  `variants={{\n                                hidden: { opacity: 0, y: 20 },\n                                show: { opacity: 1, y: 0 },\n                              }}\n                              ${dynamicClass}\n                            >`);

fs.writeFileSync('src/app/(customer)/home/page.tsx', c);
