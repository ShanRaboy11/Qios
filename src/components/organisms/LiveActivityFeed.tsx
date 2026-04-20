import { Clock } from "lucide-react";

const activityData = [
  {
    name: "Maria",
    action: "Completed Order #8821",
    time: "Just now",
    dotColor: "bg-success-primary",
  },
  {
    name: "Juan",
    action: "Processing Order #5247",
    time: "1m ago",
    dotColor: "bg-brand-primary",
  },
  {
    name: "Justin",
    action: "Completed Order #2467",
    time: "2m ago",
    dotColor: "bg-success-primary",
  },
  {
    name: "Ken",
    action: "Cancelled Order #1636",
    time: "2m ago",
    dotColor: "bg-warning-primary",
  },
  {
    name: "DJ",
    action: "Processing Order #1369",
    time: "2m ago",
    dotColor: "bg-brand-primary",
  },
  {
    name: "Maria",
    action: "Processing Order #8821",
    time: "2m ago",
    dotColor: "bg-brand-primary",
  },
  {
    name: "Kian",
    action: "Cancelled Order #2571",
    time: "3m ago",
    dotColor: "bg-warning-primary",
  },
  {
    name: "Mark",
    action: "Completed Order #5638",
    time: "3m ago",
    dotColor: "bg-success-primary",
  },
  {
    name: "Shiela",
    action: "Completed Order #1640",
    time: "3m ago",
    dotColor: "bg-success-primary",
  },
  {
    name: "Erik",
    action: "Completed Order #3281",
    time: "4m ago",
    dotColor: "bg-success-primary",
  },
  {
    name: "Edward",
    action: "Processing Order #2371",
    time: "4m ago",
    dotColor: "bg-brand-primary",
  },
];

export const LiveActivityFeed = (): JSX.Element => {
  return (
    <div className="flex flex-col w-[366px] h-[716px] items-start gap-[25px] pt-[21px] pb-px px-[21px] relative bg-white rounded-[10px] border border-solid border-[#f0f0f0]">
      <div className="flex h-6 items-center gap-2 relative self-stretch w-full">
        <div className="relative w-[131.11px] h-6">
          <div className="absolute -top-px left-0 font-[number:var(--body-b3-font-weight)] text-[#2d2d2d] text-[length:var(--body-b3-font-size)] tracking-[var(--body-b3-letter-spacing)] leading-[var(--body-b3-line-height)] whitespace-nowrap [font-style:var(--body-b3-font-style)]">
            Live Activity Feed
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[625px] items-start gap-3 relative self-stretch w-full">
        {activityData.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-[#f0f0f0]"
          >
            <div className="relative w-[18px] h-[38px]">
              <div
                className={`relative top-[3px] w-1.5 h-1.5 ${item.dotColor} rounded-[33554400px]`}
              />
            </div>
            <div className="flex flex-col w-[198px] h-[45px] items-start gap-1 relative">
              <div className="flex h-6 items-start justify-around pl-0 pr-[477.48px] py-0 relative self-stretch w-full">
                <div className="relative w-[186.52px] h-6 mr-[-466.00px]">
                  <p className="absolute top-0.5 left-0 [font-family:'Inter-SemiBold',Helvetica] font-normal text-transparent text-[13px] tracking-[0] leading-[19.5px] whitespace-nowrap">
                    <span className="font-semibold text-[#2d2d2d]">
                      {item.name}{" "}
                    </span>
                    <span className="[font-family:'Inter-Regular',Helvetica] text-[#707070]">
                      {item.action}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex h-[16.5px] items-center gap-1 relative self-stretch w-full">
                <Clock className="w-2.5 h-2.5" />
                <div className="relative w-[47.19px] h-[16.5px]">
                  <div className="absolute top-0 left-0 [font-family:'Inter-Regular',Helvetica] font-normal text-text-secondary text-[11px] tracking-[0] leading-[16.5px] whitespace-nowrap">
                    {item.time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
