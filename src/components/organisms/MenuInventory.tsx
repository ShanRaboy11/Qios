"use client";

import React from "react";

const imgDishPlaceholder =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240'><rect width='320' height='240' fill='%23f3f4f6'/><rect x='24' y='24' width='272' height='192' rx='16' fill='%23e5e7eb'/><circle cx='160' cy='104' r='36' fill='%239ca3af'/><path d='M106 168c16-20 35-30 54-30s38 10 54 30' fill='none' stroke='%239ca3af' stroke-width='12' stroke-linecap='round'/><text x='160' y='214' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='%236b7280'>Dish image</text></svg>";

const svgPaths = {
  pTabShape:
    "M1209 63C1225.57 63 1239 76.4315 1239 93V807H0V63H0C22.308 63 17.532 63 18.141 12.0254C18.22 5.39845 23.578 0 30.205 0H120.205C126.832 0 132.19 5.39845 132.269 12.0254C132.878 63 138.102 63 160.41 63H1209Z",
  p29a32100:
    "M7 1.16699C3.78334 1.16699 1.16667 3.78366 1.16667 7.00033C1.16667 10.217 3.78334 12.8337 7 12.8337C10.2167 12.8337 12.8333 10.217 12.8333 7.00033C12.8333 3.78366 10.2167 1.16699 7 1.16699Z",
  p25f52600:
    "M7 0C3.134 0 0 3.134 0 7C0 10.866 3.134 14 7 14C8.474 14 9.843 13.542 10.97 12.765L14.664 16.45C15.054 16.84 15.687 16.84 16.077 16.45C16.467 16.06 16.467 15.427 16.077 15.037L12.365 11.325C13.19 10.19 13.666 8.8 13.666 7C13.666 3.134 10.532 0 7 0ZM7 2C9.76 2 12 4.24 12 7C12 9.76 9.76 12 7 12C4.24 12 2 9.76 2 7C2 4.24 4.24 2 7 2Z",
  p2611f400: "M8.4 0.9V15.9M0.9 8.4H15.9",
  p9b36e80:
    "M13.4063 0.9375C12.7813 0.3125 11.7813 0.3125 11.1563 0.9375L1.2188 10.875L0.75 13.875L3.75 13.4063L13.6875 3.4688C14.3125 2.8438 14.3125 1.8438 13.6875 1.2188L13.4063 0.9375Z",
};

/* --- Header ------------------------------------------------ */
function PageHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <button className="w-[27px] h-[27px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
          >
            <path
              d="M11.9248 14.2987C11.8194 14.1941 11.7357 14.0697 11.6786 13.9326C11.6215 13.7955 11.5921 13.6484 11.5921 13.4999C11.5921 13.3514 11.6215 13.2044 11.6786 13.0673C11.7357 12.9302 11.8194 12.8057 11.9248 12.7012L17.0886 7.54867C17.194 7.44408 17.2777 7.31966 17.3348 7.18256C17.392 7.04547 17.4214 6.89843 17.4214 6.74992C17.4214 6.6014 17.392 6.45436 17.3348 6.31727C17.2777 6.18017 17.194 6.05575 17.0886 5.95116C16.8778 5.74163 16.5927 5.62402 16.2955 5.62402C15.9983 5.62402 15.7131 5.74163 15.5023 5.95116L10.3386 11.1149C9.70656 11.7477 9.35156 12.6055 9.35156 13.4999C9.35156 14.3943 9.70656 15.2521 10.3386 15.8849L15.5023 21.0487C15.7119 21.2565 15.9947 21.3737 16.2898 21.3749C16.4379 21.3758 16.5847 21.3474 16.7217 21.2914C16.8588 21.2354 16.9835 21.1529 17.0886 21.0487C17.194 20.9441 17.2777 20.8197 17.3348 20.6826C17.392 20.5455 17.4214 20.3984 17.4214 20.2499C17.4214 20.1014 17.392 19.9544 17.3348 19.8173C17.2777 19.6802 17.194 19.5557 17.0886 19.4512L11.9248 14.2987Z"
              fill="#2D2D2D"
            />
          </svg>
        </button>
        <p className="font-['Figtree',sans-serif] font-medium text-[#2d2d2d] text-[31px] leading-none">
          Inventory
        </p>
      </div>
      <div className="bg-[rgba(255,82,105,0.15)] border border-[#ff5269] rounded-[10px] px-4 py-1">
        <p className="font-['Inter',sans-serif] text-[#ff5269] text-[10.24px] whitespace-nowrap">
          Unit-based
        </p>
      </div>
    </div>
  );
}

/* --- Info Banner ------------------------------------------- */
function InfoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 w-full bg-[rgba(255,215,122,0.15)] rounded-full py-1.5 px-4">
      <div className="shrink-0 size-[14px] relative">
        <svg
          className="absolute inset-0 size-full"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            d={svgPaths.p29a32100}
            stroke="#FF5269"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 4.7425V7.56"
            stroke="#FF5269"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.9968 9.33333H7.00204"
            stroke="#FF5269"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="font-['Inter',sans-serif] text-[#ff5269] text-[10.24px]">
        Note: Unit-based inventory deducts one (1) unit from stock per order.
      </p>
    </div>
  );
}

/* --- Add New Dish Slot ------------------------------------- */
function AddDish() {
  return (
    <div
      className="relative flex-1 min-w-0 flex flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#ff5269] bg-[rgba(255,82,105,0.05)]"
      style={{ minHeight: "299px" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 rounded-[8px]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 16.8 16.8">
            <path
              d={svgPaths.p2611f400}
              stroke="#FF5269"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <p className="font-['Inter',sans-serif] font-medium text-[#ff5269] text-[16px] text-center">
          Add new dish
        </p>
      </div>
    </div>
  );
}

/* --- Edit Dish Button -------------------------------------- */
function EditDishButton() {
  return (
    <div className="relative rounded-b-[8px] overflow-hidden">
      <div className="absolute inset-0 bg-[#ff5269] opacity-[0.24]" />
      <div className="relative flex items-center justify-center gap-2 py-[7px]">
        <svg
          className="shrink-0 w-[14px] h-[14px]"
          fill="none"
          viewBox="0 0 15 14.1667"
        >
          <path d={svgPaths.p9b36e80} fill="#FF5269" />
        </svg>
        <span className="font-['Inter',sans-serif] text-[#ff5269] text-[12.8px]">
          Edit dish
        </span>
      </div>
    </div>
  );
}

/* --- Dish Card --------------------------------------------- */
interface DishCardData {
  name: string;
  servings: number;
  status: string;
  statusColor: string;
  statusBg: string;
}

function DishCard({ data }: { data: DishCardData }) {
  return (
    <div
      className="relative flex-1 min-w-0 bg-[#ffd77a] border border-[#ff5269] rounded-[8px] flex flex-col overflow-hidden"
      style={{ minHeight: "299px" }}
    >
      {/* Image */}
      <div className="flex-1 flex items-center justify-center px-4 pt-6 pb-2">
        <img
          alt={data.name}
          className="w-[127px] h-[127px] object-cover rounded-[10px]"
          src={imgDishPlaceholder}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-2 px-3 pb-4">
        <p className="font-['Inter',sans-serif] font-semibold text-[#2d2d2d] text-[16px] text-center leading-tight w-[144px]">
          {data.name}
        </p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <p className="font-['Inter',sans-serif] text-[#707070] text-[12.8px] text-center whitespace-nowrap">
            {data.servings} Servings Available
          </p>
          <div
            className="rounded-full px-[7px] h-[16px] flex items-center"
            style={{
              backgroundColor: data.statusBg,
              border: `1px solid ${data.statusColor}`,
            }}
          >
            <p
              className="font-['Inter',sans-serif] text-[10.24px] whitespace-nowrap"
              style={{ color: data.statusColor }}
            >
              {data.status}
            </p>
          </div>
        </div>
      </div>

      {/* Edit button */}
      <EditDishButton />
    </div>
  );
}

/* --- Data -------------------------------------------------- */
const dishData: DishCardData[] = [
  {
    name: "Spicy Seafood Noodles",
    servings: 20,
    status: "High",
    statusColor: "#1fad66",
    statusBg: "rgba(31,173,102,0.15)",
  },
  {
    name: "Grilled Chicken Rice",
    servings: 15,
    status: "High",
    statusColor: "#1fad66",
    statusBg: "rgba(31,173,102,0.15)",
  },
  {
    name: "Beef Steak Plate",
    servings: 8,
    status: "Medium",
    statusColor: "#8b5cf6",
    statusBg: "rgba(139,92,246,0.15)",
  },
  {
    name: "Vegetable Stir Fry",
    servings: 3,
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
    statusBg: "rgba(236,19,19,0.15)",
  },
  {
    name: "Pork Fried Rice",
    servings: 20,
    status: "High",
    statusColor: "#1fad66",
    statusBg: "rgba(31,173,102,0.15)",
  },
  {
    name: "Tom Yum Soup",
    servings: 12,
    status: "High",
    statusColor: "#1fad66",
    statusBg: "rgba(31,173,102,0.15)",
  },
  {
    name: "Pad Thai Noodles",
    servings: 9,
    status: "Medium",
    statusColor: "#8b5cf6",
    statusBg: "rgba(139,92,246,0.15)",
  },
  {
    name: "Mango Sticky Rice",
    servings: 5,
    status: "Medium",
    statusColor: "#8b5cf6",
    statusBg: "rgba(139,92,246,0.15)",
  },
  {
    name: "Green Curry Bowl",
    servings: 2,
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
    statusBg: "rgba(236,19,19,0.15)",
  },
];

/* --- Grid -------------------------------------------------- */
function Grid() {
  const COLS = 5;
  const rows: React.ReactNode[] = [];

  // Row 0: AddDish + first 4 dish cards
  rows.push(
    <div key="row-0" className="flex gap-4 w-full">
      <AddDish />
      {dishData.slice(0, COLS - 1).map((dish, i) => (
        <DishCard key={i} data={dish} />
      ))}
    </div>,
  );

  // Remaining rows
  for (let i = COLS - 1; i < dishData.length; i += COLS) {
    const rowItems = dishData.slice(i, i + COLS);
    rows.push(
      <div key={`row-${i}`} className="flex gap-4 w-full">
        {rowItems.map((dish, j) => (
          <DishCard key={j} data={dish} />
        ))}
        {rowItems.length < COLS &&
          Array.from({ length: COLS - rowItems.length }, (_, k) => (
            <div key={`spacer-${k}`} className="flex-1 min-w-0" />
          ))}
      </div>,
    );
  }

  return <div className="flex flex-col gap-5 w-full">{rows}</div>;
}

/* --- Yellow outer container -------------------------------- */
function YellowContainer() {
  return (
    <div
      className="relative w-full bg-[#FFD77A] rounded-t-[30px] flex flex-col"
      style={{ minHeight: "500px" }}
    >
      {/* SVG union shape: cream inner area */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg
          className="absolute block inset-0 w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1239 807"
        >
          <g>
            <mask fill="white" id="tab-mask-menu">
              <path d={svgPaths.pTabShape} />
            </mask>
            <path d={svgPaths.pTabShape} fill="#FFF9EF" />
            <path
              d={svgPaths.pTabShape}
              fill="#FFC670"
              fillOpacity="1"
              mask="url(#tab-mask-menu)"
              style={{ fill: "none", stroke: "#FFC670", strokeWidth: 2 }}
            />
          </g>
        </svg>
      </div>

      {/* Tab bar row */}
      <div
        className="relative z-10 flex items-center justify-between pl-[30px] pr-[17px]"
        style={{ height: "63px" }}
      >
        {/* Left: Menu (selected) + Ingredients */}
        <div className="flex items-center gap-2">
          <button className="px-5 py-2 rounded-[10px] bg-[#FFD77A] text-[16px] font-['Inter',sans-serif] font-semibold text-[#ff5269]">
            Menu
          </button>
          <button className="px-4 text-[16px] font-['Inter',sans-serif] font-medium text-[#2d2d2d]">
            Ingredients
          </button>
        </div>

        {/* Right: Search + Filters */}
        <div className="flex items-center gap-3">
          <div className="relative bg-white border border-[#e5e7eb] rounded-2xl h-[44px] flex items-center px-5 gap-3 w-[340px]">
            <svg
              className="shrink-0 w-4 h-4"
              fill="none"
              viewBox="0 0 16.67 16.67"
            >
              <path d={svgPaths.p25f52600} fill="#707070" />
            </svg>
            <span className="font-['Inter',sans-serif] text-[#707070] text-[16px]">
              Search
            </span>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-2xl h-[44px] flex items-center gap-2 px-4">
            <svg className="shrink-0 size-5" fill="none" viewBox="0 0 20 20">
              <path
                d="M17.67 3.33H11.84"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M8.51 3.33H2.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M17.67 10H10.17"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M6.84 10H2.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M17.67 16.67H13.51"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M10.17 16.67H2.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M11.84 1.67V5"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M6.84 8.33V11.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M13.51 15V18.33"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
            </svg>
            <span className="font-['Inter',sans-serif] text-[#707070] text-[16px]">
              Filters
            </span>
          </div>
        </div>
      </div>

      {/* Inner content */}
      <div className="relative z-10 flex-1 mx-[17px] mb-[17px] px-7 py-8 flex flex-col gap-9 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <p className="font-['Figtree',sans-serif] text-[#2d2d2d] text-[25px] leading-none">
            Meal
          </p>
          <Grid />
        </div>
      </div>
    </div>
  );
}

/* --- Root export ------------------------------------------- */
export default function MenuInventory() {
  return (
    <div className="bg-[#FFF9EF] w-full h-full flex flex-col px-[100px] py-[50px] gap-6">
      <PageHeader />
      <InfoBanner />
      <YellowContainer />
    </div>
  );
}
