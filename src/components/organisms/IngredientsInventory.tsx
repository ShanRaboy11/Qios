interface IngredientItem {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  image: string;
  inStock: string;
  status: string;
  statusColor: string;
}

const ingredientData: IngredientItem[] = [
  {
    id: "1",
    name: "Chicken Breast",
    category: "Meat & Poultry",
    categoryColor: "bg-violet-500/20",
    image: "https://placehold.co/50x50",
    inStock: "10 kg",
    status: "High",
    statusColor: "text-green-500",
  },
  {
    id: "2",
    name: "Bok Choy",
    category: "Fresh Produce",
    categoryColor: "bg-green-500/20",
    image: "https://placehold.co/50x50",
    inStock: "1.5 kg",
    status: "Low",
    statusColor: "text-red-600/90",
  },
  {
    id: "3",
    name: "Bok Choy",
    category: "Fresh Produce",
    categoryColor: "bg-green-500/20",
    image: "https://placehold.co/50x50",
    inStock: "1.5 kg",
    status: "Low",
    statusColor: "text-red-600/90",
  },
  {
    id: "4",
    name: "Bok Choy",
    category: "Seafood",
    categoryColor: "bg-green-500/20",
    image: "https://placehold.co/50x50",
    inStock: "1.5 kg",
    status: "Low",
    statusColor: "text-red-600/90",
  },
  {
    id: "5",
    name: "Chicken Breast",
    category: "Dairy & Eggs",
    categoryColor: "bg-violet-500/20",
    image: "https://placehold.co/50x50",
    inStock: "10 kg",
    status: "High",
    statusColor: "text-green-500",
  },
  {
    id: "6",
    name: "Bok Choy",
    category: "Seafood",
    categoryColor: "bg-green-500/20",
    image: "https://placehold.co/50x50",
    inStock: "1.5 kg",
    status: "Low",
    statusColor: "text-red-600/90",
  },
  {
    id: "7",
    name: "Chicken Breast",
    category: "Dairy & Eggs",
    categoryColor: "bg-violet-500/20",
    image: "https://placehold.co/50x50",
    inStock: "10 kg",
    status: "High",
    statusColor: "text-green-500",
  },
  {
    id: "8",
    name: "Bok Choy",
    category: "Seafood",
    categoryColor: "bg-green-500/20",
    image: "https://placehold.co/50x50",
    inStock: "1.5 kg",
    status: "Low",
    statusColor: "text-red-600/90",
  },
  {
    id: "9",
    name: "Chicken Breast",
    category: "Dairy & Eggs",
    categoryColor: "bg-violet-500/20",
    image: "https://placehold.co/50x50",
    inStock: "10 kg",
    status: "High",
    statusColor: "text-green-500",
  },
];

export const IngredientsInventory = (): JSX.Element => {
  return (
    <div className="px-24 py-12 bg-orange-50 inline-flex justify-start items-start gap-2.5 overflow-hidden">
      <div className="w-[1239px] inline-flex flex-col justify-start items-start gap-6">
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex justify-start items-center gap-3.5">
            <div className="w-7 h-7 relative overflow-hidden">
              <div className="w-2 h-4 left-[9.35px] top-[5.62px] absolute bg-zinc-800" />
            </div>
            <div className="justify-start text-zinc-800 text-3xl font-medium font-['Figtree']">
              Inventory
            </div>
          </div>
          <div className="w-28 h-6 px-4 py-2 bg-rose-500/20 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-rose-500 flex justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-rose-500 text-[10.24px] font-normal font-['Inter']">
              Measurement-based
            </div>
          </div>
        </div>
        <div className="self-stretch h-6 px-4 py-2 bg-amber-200/20 rounded-[100px] inline-flex justify-center items-center gap-1.5 overflow-hidden">
          <div data-property-1="linear" className="w-3.5 h-3.5 relative">
            <div className="w-3 h-3 left-[1.17px] top-[1.17px] absolute outline outline-1 outline-offset-[-0.50px] outline-rose-500" />
            <div className="w-0 h-[2.82px] left-[7px] top-[4.74px] absolute outline outline-1 outline-offset-[-0.50px] outline-rose-500" />
            <div className="w-[0.01px] h-[0.58px] left-[7px] top-[9.33px] absolute outline outline-1 outline-offset-[-0.50px] outline-rose-500" />
            <div className="w-3.5 h-3.5 left-0 top-0 absolute opacity-0" />
          </div>
          <div className="justify-start text-rose-500 text-[10.24px] font-normal font-['Inter']">
            Note: Measurement-based inventory deducts stock based on the
            quantity specified per order.
          </div>
        </div>
        <div className="self-stretch h-[824px] pt-4 bg-amber-200 rounded-tl-[30px] rounded-tr-[30px] outline outline-[1.50px] outline-offset-[-1.50px] outline-orange-300 flex flex-col justify-start items-start gap-2.5">
          <div className="w-[1239px] h-[807px] px-7 relative flex flex-col justify-start items-start gap-9">
            <div className="inline-flex justify-start items-end gap-80">
              <div data-property-1="Variant2" className="w-52 h-9 relative">
                <div
                  data-active="No"
                  data-icon-l-on="false"
                  data-icon-r-on="false"
                  data-label-on="true"
                  data-size="1"
                  data-state="Enabled"
                  data-type="Transparent"
                  className="w-20 h-9 p-4 left-0 top-0 absolute rounded-[100px] inline-flex justify-center items-center overflow-hidden"
                >
                  <div className="px-4 flex justify-start items-start gap-2">
                    <div className="justify-start text-zinc-800 text-base font-medium font-['Inter']">
                      Menu
                    </div>
                  </div>
                </div>
                <div
                  data-active="No"
                  data-icon-l-on="false"
                  data-icon-r-on="false"
                  data-label-on="true"
                  data-size="1"
                  data-state="Enabled"
                  data-type="Primary2"
                  className="w-32 h-9 p-4 left-[88px] top-0 absolute bg-amber-200 rounded-md inline-flex justify-center items-center overflow-hidden"
                >
                  <div className="px-4 flex justify-start items-start gap-2">
                    <div className="justify-start text-rose-500 text-base font-medium font-['Inter']">
                      Ingredients
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center gap-2.5">
                <div className="w-[523px] h-12 pl-5 pr-[1021px] py-4 bg-white rounded-2xl outline outline-[1.45px] outline-offset-[-1.45px] outline-gray-200 inline-flex flex-col justify-start items-start gap-2.5">
                  <div className="inline-flex justify-start items-center gap-3">
                    <div className="flex justify-center items-center gap-2.5">
                      <div className="justify-start text-neutral-500 text-base font-normal font-['Inter']">
                        Search
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-28 h-12 pl-4 bg-white rounded-2xl outline outline-[1.45px] outline-offset-[-1.45px] outline-gray-200 flex justify-start items-center gap-2">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <div className="w-1.5 h-0 left-[11.84px] top-[3.33px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-1.5 h-0 left-[2.67px] top-[3.33px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-2 h-0 left-[10.17px] top-[10px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-1 h-0 left-[2.67px] top-[10px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-1 h-0 left-[13.51px] top-[16.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-2 h-0 left-[2.67px] top-[16.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-0 h-[3.33px] left-[11.84px] top-[1.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-0 h-[3.33px] left-[6.84px] top-[8.33px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                    <div className="w-0 h-[3.33px] left-[13.51px] top-[15px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-500" />
                  </div>
                  <div className="w-12 h-6 relative">
                    <div className="left-[0.32px] top-[1.55px] absolute text-center justify-start text-neutral-500 text-base font-normal font-['Inter']">
                      Filters
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[1174px] flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-start text-zinc-800 text-2xl font-normal font-['Figtree']">
                Fresh Produce
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-5">
                {/* Add New Ingredient Button */}
                <div className="inline-flex justify-start items-center gap-5">
                  <div className="w-[577px] px-40 py-2.5 rounded-lg outline outline-1 outline-offset-[-0.50px] outline-rose-500 inline-flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch h-12 inline-flex justify-center items-center gap-2">
                      <div
                        data-icon="True"
                        data-state="Icon Default"
                        data-type="Line"
                        className="p-3.5 rounded-lg flex justify-start items-start gap-2.5"
                      >
                        <div className="w-5 h-5 relative">
                          <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute outline outline-2 outline-offset-[-0.90px] outline-rose-500" />
                        </div>
                      </div>
                      <div className="text-center justify-start text-rose-500 text-base font-medium font-['Inter']">
                        Add new ingredient
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredient Items - Mapped */}
                {ingredientData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`self-stretch inline-flex justify-start items-center gap-5 ${
                      index % 2 === 0 ? "" : ""
                    }`}
                  >
                    <div className="w-[577px] h-16 pl-3 pr-2.5 py-1.5 bg-amber-200 rounded-lg outline outline-1 outline-offset-[-0.50px] outline-rose-500 inline-flex flex-col justify-start items-start gap-2.5">
                      <div className="w-[554px] h-14 inline-flex justify-start items-center gap-7">
                        <div className="flex justify-start items-center gap-3.5">
                          <img
                            className="w-12 h-12 rounded-xl"
                            src={item.image}
                            alt={item.name}
                          />
                          <div className="flex justify-start items-end gap-10">
                            <div className="w-36 inline-flex flex-col justify-start items-start gap-[5px]">
                              <div
                                className={`h-4 px-1.5 py-2 ${item.categoryColor} rounded-[100px] outline outline-1 outline-offset-[-1px] ${
                                  item.category === "Meat & Poultry" ||
                                  item.category === "Dairy & Eggs"
                                    ? "outline-violet-500"
                                    : item.category === "Fresh Produce"
                                      ? "outline-green-500"
                                      : "outline-green-500"
                                } inline-flex justify-center items-center gap-2.5 overflow-hidden`}
                              >
                                <div
                                  className={`justify-start ${
                                    item.category === "Meat & Poultry" ||
                                    item.category === "Dairy & Eggs"
                                      ? "text-violet-500"
                                      : "text-green-500"
                                  } text-[10.24px] font-normal font-['Inter']`}
                                >
                                  {item.category}
                                </div>
                              </div>
                              <div className="self-stretch justify-start text-zinc-800 text-base font-semibold font-['Inter']">
                                {item.name}
                              </div>
                            </div>
                            <div className="w-20 inline-flex flex-col justify-start items-start gap-[5px]">
                              <div className="self-stretch justify-start text-neutral-500 text-xs font-normal font-['Inter']">
                                In Stock
                              </div>
                              <div className="self-stretch justify-start text-zinc-800 text-base font-semibold font-['Inter']">
                                {item.inStock}
                              </div>
                            </div>
                            <div className="w-16 inline-flex flex-col justify-start items-start gap-[5px]">
                              <div className="self-stretch justify-start text-neutral-500 text-xs font-normal font-['Inter']">
                                Status
                              </div>
                              <div
                                className={`self-stretch justify-start ${item.statusColor} text-base font-semibold font-['Inter']`}
                              >
                                {item.status}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-20 h-10 opacity-25 bg-rose-500 rounded-xl" />
                        <div className="w-5 h-5 relative bg-black/0 overflow-hidden">
                          <div className="w-3.5 h-3.5 left-[2.50px] top-[3.08px] absolute bg-rose-500" />
                        </div>
                        <div className="w-6 h-4 justify-center text-rose-500 text-xs font-normal font-['Inter']">
                          Edit
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
