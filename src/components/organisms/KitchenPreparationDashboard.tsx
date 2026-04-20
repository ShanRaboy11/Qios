import React from "react";
export default (): JSX.Element => {
  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#FEF9F6] p-4">
        <div className="flex items-center self-stretch mb-4 gap-3">
          <div
            className="flex flex-1 items-center bg-white p-3 gap-2.5 rounded-[14px] border border-solid border-gray-100"
            style={{
              boxShadow: "0px 1px 2px #0000001A",
            }}
          >
            <button
              className="flex flex-col shrink-0 items-start bg-[#FF52691A] text-left py-1 px-[13px] rounded-[14px] border-0"
              onClick={() => alert("Pressed!")}
            >
              <span className="text-[#FF5269] text-lg font-bold">{"4"}</span>
            </button>
            <div className="flex flex-col shrink-0 items-start gap-[1px]">
              <div className="flex flex-col items-start mr-7">
                <span className="text-[#6A7282] text-[10px]">
                  {"Preparing"}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#101828] text-sm font-bold">
                  {"Active orders"}
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex flex-1 items-center bg-white p-3 gap-2.5 rounded-[14px] border border-solid border-gray-100"
            style={{
              boxShadow: "0px 1px 2px #0000001A",
            }}
          >
            <button
              className="flex flex-col shrink-0 items-start bg-gray-100 text-left py-1 px-[13px] rounded-[14px] border-0"
              onClick={() => alert("Pressed!")}
            >
              <span className="text-[#364153] text-lg font-bold">{"2"}</span>
            </button>
            <div className="flex flex-col shrink-0 items-start gap-[1px]">
              <div className="flex flex-col items-start mr-[11px]">
                <span className="text-[#6A7282] text-[10px]">{"Pending"}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#101828] text-sm font-bold">
                  {"In queue"}
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex flex-1 items-center bg-white p-3 gap-2.5 rounded-[14px] border border-solid border-gray-100"
            style={{
              boxShadow: "0px 1px 2px #0000001A",
            }}
          >
            <button
              className="flex flex-col shrink-0 items-start bg-[#10B9811A] text-left py-1 px-[13px] rounded-[14px] border-0"
              onClick={() => alert("Pressed!")}
            >
              <span className="text-emerald-500 text-lg font-bold">{"1"}</span>
            </button>
            <div className="flex flex-col shrink-0 items-start gap-[1px]">
              <div className="flex flex-col items-start mr-[35px]">
                <span className="text-[#6A7282] text-[10px]">{"Ready"}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#101828] text-sm font-bold">
                  {"For pickup"}
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex flex-1 items-center bg-white p-3 gap-2.5 rounded-[14px] border border-solid border-gray-100"
            style={{
              boxShadow: "0px 1px 2px #0000001A",
            }}
          >
            <button
              className="flex flex-col shrink-0 items-start bg-[#FB923C1A] text-left py-1 px-[13px] rounded-[14px] border-0"
              onClick={() => alert("Pressed!")}
            >
              <span className="text-orange-400 text-lg font-bold">{"7"}</span>
            </button>
            <div className="flex flex-col shrink-0 items-start gap-[1px]">
              <div className="flex flex-col items-start">
                <span className="text-[#6A7282] text-[10px]">
                  {"7 min avg"}
                </span>
              </div>
              <div className="flex flex-col items-start mr-[18px]">
                <span className="text-[#101828] text-sm font-bold">
                  {"Total"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col self-stretch mb-[21px] gap-[11px]">
          <div className="flex items-center self-stretch gap-2">
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/8p4yzl4s_expires_30_days.png"
              }
              className="w-4 h-4 object-fill"
            />
            <span className="text-[#101828] text-base font-bold">
              {"Preparing Now"}
            </span>
          </div>
          <div className="flex flex-col self-stretch gap-3">
            <div className="flex items-center self-stretch gap-3">
              <div
                className="flex-1 bg-white py-[21px] px-5 rounded-2xl border border-solid border-gray-100"
                style={{
                  boxShadow: "0px 1px 2px #0000001A",
                }}
              >
                <div className="flex justify-between items-center self-stretch mb-3">
                  <div className="flex shrink-0 items-center gap-[9px]">
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#101828] text-base font-bold">
                        {"#R-4821"}
                      </span>
                    </div>
                    <button
                      className="flex shrink-0 items-center bg-[#FF52691A] text-left py-[3px] px-2.5 gap-1 rounded-[26843500px] border border-solid border-[#FFCCD4]"
                      onClick={() => alert("Pressed!")}
                    >
                      <img
                        src={
                          "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/hbol6ap9_expires_30_days.png"
                        }
                        className="w-3 h-3 rounded-[26843500px] object-fill"
                      />
                      <span className="text-[#FF5269] text-xs">
                        {"Preparing"}
                      </span>
                    </button>
                  </div>
                  <div className="flex shrink-0 items-center bg-orange-50 py-1 px-2.5 gap-[3px] rounded-[10px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/b0syqw6n_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[10px] object-fill"
                    />
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#F54900] text-xs font-bold">
                        {"10:22"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch mb-[13px] gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">
                      {"Counter 3"}
                    </span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">{"Dine-in"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">
                      {"86% of target time"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col self-stretch mb-[11px] gap-[9px]">
                  <div className="flex items-center self-stretch gap-[9px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/qqf1syn5_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Garlic Fried Rice"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Extra crispy"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch gap-[9px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/m5jkz96y_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Soy Chicken"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Extra crispy"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch gap-[9px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/icrhaubu_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Mango Shake"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Medium"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-start self-stretch bg-[#00000000] py-[11px] px-3 mb-[13px] gap-[7px] rounded-[14px] border border-solid border-orange-400"
                  style={{
                    boxShadow: "0px 1px 2px #0000001A",
                  }}
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/d23x38ra_expires_30_days.png"
                    }
                    className="w-5 h-5 object-fill"
                  />
                  <div className="flex flex-1 flex-col gap-[1px]">
                    <div className="flex items-center self-stretch gap-1">
                      <div className="bg-orange-400 w-1 h-1 rounded-[26843500px]"></div>
                      <span className="text-orange-400 text-[10px] font-bold">
                        {"AI Special Instructions"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-amber-800 text-xs">
                        {
                          "No onions - customer has allergy, ensure no cross-contamination"
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[5px] gap-2">
                  <button
                    className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-[15px] rounded-xl border border-solid border-[#FFC670]"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-[#FFC670] text-xs">{"Pending"}</span>
                  </button>
                  <button
                    className="flex flex-col shrink-0 items-start bg-[#FF5269] text-left py-1.5 px-2.5 rounded-xl border-0"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-white text-xs">{"Preparing"}</span>
                  </button>
                  <button
                    className="flex flex-1 justify-center items-center bg-emerald-500 text-left py-1.5 gap-1 rounded-[14px] border-0"
                    style={{
                      boxShadow: "0px 1px 2px #0000001A",
                    }}
                    onClick={() => alert("Pressed!")}
                  >
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/cze59410_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[14px] object-fill"
                    />
                    <span className="text-white text-xs">{"Mark Ready"}</span>
                  </button>
                </div>
              </div>
              <div
                className="flex flex-1 flex-col items-start bg-white py-[23px] pr-5 rounded-2xl border border-solid border-gray-100"
                style={{
                  boxShadow: "0px 1px 2px #0000001A",
                }}
              >
                <div className="flex justify-between items-center self-stretch mb-3 ml-5">
                  <div className="flex shrink-0 items-center gap-[9px]">
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#101828] text-base font-bold">
                        {"#R-4822"}
                      </span>
                    </div>
                    <button
                      className="flex shrink-0 items-center bg-[#FF52691A] text-left py-[3px] px-2.5 gap-1 rounded-[26843500px] border border-solid border-[#FFCCD4]"
                      onClick={() => alert("Pressed!")}
                    >
                      <img
                        src={
                          "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/p91idv0d_expires_30_days.png"
                        }
                        className="w-3 h-3 rounded-[26843500px] object-fill"
                      />
                      <span className="text-[#FF5269] text-xs">
                        {"Preparing"}
                      </span>
                    </button>
                  </div>
                  <div className="flex shrink-0 items-center bg-green-50 py-1 px-2.5 gap-[3px] rounded-[10px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/zm70kp7u_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[10px] object-fill"
                    />
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#00A63E] text-xs font-bold">
                        {"5:22"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-[13px] ml-5">
                  <div className="flex flex-col shrink-0 items-start mr-[9px]">
                    <span className="text-[#6A7282] text-xs">
                      {"Counter 2"}
                    </span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start mr-[9px]">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start mr-2">
                    <span className="text-[#6A7282] text-xs">{"Takeout"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start mr-[9px]">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">
                      {"53% of target time"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col self-stretch mb-[63px] ml-5 gap-[9px]">
                  <div className="flex items-center self-stretch gap-[9px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/d8rjpdun_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Kare-Kare Meal"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Mild to peanut sauce"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch gap-[9px]">
                    <div className="flex flex-col shrink-0 items-start relative">
                      <img
                        src={
                          "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/dynn6dav_expires_30_days.png"
                        }
                        className="w-10 h-10 object-fill"
                      />
                      <div
                        className="flex flex-col items-start bg-[#00000000] absolute top-0 right-0 pb-1 px-1.5 rounded-[26843500px]"
                        style={{
                          boxShadow: "0px 2px 4px #0000001A",
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-white text-[11px] font-bold">
                            {"2"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Lumpia Shanghai"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"10 pieces"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-start self-stretch bg-[#00000000] p-[11px] mb-4 ml-[21px] gap-[7px] rounded-[14px] border border-solid border-orange-400"
                  style={{
                    boxShadow: "0px 1px 2px #0000001A",
                  }}
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/4gimo9w1_expires_30_days.png"
                    }
                    className="w-5 h-5 object-fill"
                  />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center self-stretch gap-1">
                      <div className="bg-orange-400 w-1 h-1 rounded-[26843500px]"></div>
                      <span className="text-orange-400 text-[10px] font-bold">
                        {"AI Special Instructions"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch pb-[1px]">
                      <span className="text-amber-800 text-xs">
                        {"Rush order - customer is in hurry for meeting"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch ml-5 gap-2">
                  <button
                    className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-[15px] rounded-xl border border-solid border-[#FFC670]"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-[#FFC670] text-xs">{"Pending"}</span>
                  </button>
                  <button
                    className="flex flex-col shrink-0 items-start bg-[#FF5269] text-left py-1.5 px-2.5 rounded-xl border-0"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-white text-xs">{"Preparing"}</span>
                  </button>
                  <button
                    className="flex flex-1 justify-center items-center bg-emerald-500 text-left py-1.5 gap-1 rounded-[14px] border-0"
                    style={{
                      boxShadow: "0px 1px 2px #0000001A",
                    }}
                    onClick={() => alert("Pressed!")}
                  >
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/dypuauli_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[14px] object-fill"
                    />
                    <span className="text-white text-xs">{"Mark Ready"}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center self-stretch gap-3">
              <div
                className="flex flex-1 flex-col items-start bg-white py-[23px] pr-5 rounded-2xl border border-solid border-gray-100"
                style={{
                  boxShadow: "0px 1px 2px #0000001A",
                }}
              >
                <div className="flex justify-between items-center self-stretch mb-3 ml-5">
                  <div className="flex shrink-0 items-center gap-[9px]">
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#101828] text-base font-bold">
                        {"#R-4825"}
                      </span>
                    </div>
                    <button
                      className="flex shrink-0 items-center bg-[#FF52691A] text-left py-[3px] px-[9px] gap-[5px] rounded-[26843500px] border border-solid border-[#FFCCD4]"
                      onClick={() => alert("Pressed!")}
                    >
                      <img
                        src={
                          "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/5s919y31_expires_30_days.png"
                        }
                        className="w-3 h-3 rounded-[26843500px] object-fill"
                      />
                      <span className="text-[#FF5269] text-xs">
                        {"Preparing"}
                      </span>
                    </button>
                  </div>
                  <div className="flex shrink-0 items-center bg-green-50 py-1 px-2.5 gap-[3px] rounded-[10px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/8dwx0zj9_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[10px] object-fill"
                    />
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#00A63E] text-xs font-bold">
                        {"10:22"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-[13px] ml-5">
                  <div className="flex flex-col shrink-0 items-start mr-[9px]">
                    <span className="text-[#6A7282] text-xs">
                      {"Counter 2"}
                    </span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start mr-[9px]">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start mr-2">
                    <span className="text-[#6A7282] text-xs">{"Takeout"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start mr-[9px]">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">
                      {"69% of target time"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col self-stretch mb-[86px] ml-5 gap-[9px]">
                  <div className="flex items-center self-stretch gap-[9px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/rgu3u1zf_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Chicken Inasal Platter"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Extra chicken with java rice"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch gap-[9px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/pwos87zt_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Sinigang na Baboy"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Extra with rice extra"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch ml-5 gap-2">
                  <button
                    className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-[15px] rounded-xl border border-solid border-[#FFC670]"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-[#FFC670] text-xs">{"Pending"}</span>
                  </button>
                  <button
                    className="flex flex-col shrink-0 items-start bg-[#FF5269] text-left py-1.5 px-2.5 rounded-xl border-0"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-white text-xs">{"Preparing"}</span>
                  </button>
                  <button
                    className="flex flex-1 justify-center items-center bg-emerald-500 text-left py-1.5 gap-1 rounded-[14px] border-0"
                    style={{
                      boxShadow: "0px 1px 2px #0000001A",
                    }}
                    onClick={() => alert("Pressed!")}
                  >
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/m5wd32y5_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[14px] object-fill"
                    />
                    <span className="text-white text-xs">{"Mark Ready"}</span>
                  </button>
                </div>
              </div>
              <div
                className="flex-1 bg-white py-[21px] px-5 rounded-2xl border border-solid border-gray-100"
                style={{
                  boxShadow: "0px 1px 2px #0000001A",
                }}
              >
                <div className="flex justify-between items-center self-stretch mb-3">
                  <div className="flex shrink-0 items-center gap-[9px]">
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#101828] text-base font-bold">
                        {"#R-4827"}
                      </span>
                    </div>
                    <button
                      className="flex shrink-0 items-center bg-[#FF52691A] text-left py-[3px] px-2.5 gap-1 rounded-[26843500px] border border-solid border-[#FFCCD4]"
                      onClick={() => alert("Pressed!")}
                    >
                      <img
                        src={
                          "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/iszhn301_expires_30_days.png"
                        }
                        className="w-3 h-3 rounded-[26843500px] object-fill"
                      />
                      <span className="text-[#FF5269] text-xs">
                        {"Preparing"}
                      </span>
                    </button>
                  </div>
                  <div className="flex shrink-0 items-center bg-red-50 py-1 px-2.5 gap-[3px] rounded-[10px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/uy7p670n_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[10px] object-fill"
                    />
                    <div className="flex flex-col shrink-0 items-start">
                      <span className="text-[#E7000B] text-xs font-bold">
                        {"12:22"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch mb-[13px] gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">
                      {"Counter 1"}
                    </span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">{"Dine-in"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">{"•"}</span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#6A7282] text-xs">
                      {"103% of target time"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col self-stretch mb-[11px] gap-[9px]">
                  <div className="flex items-center self-stretch gap-[9px]">
                    <div className="flex flex-col shrink-0 items-start relative">
                      <img
                        src={
                          "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/ntmszcnh_expires_30_days.png"
                        }
                        className="w-10 h-10 object-fill"
                      />
                      <div
                        className="flex flex-col items-start bg-[#00000000] absolute top-0 right-0 pb-1 px-1.5 rounded-[26843500px]"
                        style={{
                          boxShadow: "0px 2px 4px #0000001A",
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-white text-[11px] font-bold">
                            {"2"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Sisig Rice Bowl"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Spicy with extra egg"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch gap-[9px]">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/dyhkrcft_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#101828] text-xs font-bold">
                          {"Garlic Rice"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start self-stretch">
                        <span className="text-[#6A7282] text-[11px]">
                          {"Large"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-start self-stretch bg-[#00000000] py-[11px] px-3 mb-[13px] gap-[7px] rounded-[14px] border border-solid border-orange-400"
                  style={{
                    boxShadow: "0px 1px 2px #0000001A",
                  }}
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/awjr9e68_expires_30_days.png"
                    }
                    className="w-5 h-5 object-fill"
                  />
                  <div className="flex flex-1 flex-col gap-[1px]">
                    <div className="flex items-center self-stretch gap-1">
                      <div className="bg-orange-400 w-1 h-1 rounded-[26843500px]"></div>
                      <span className="text-orange-400 text-[10px] font-bold">
                        {"AI Special Instructions"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-amber-800 text-xs">
                        {
                          "VIP customer - ensure premium presentation and garnish"
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-1.5 gap-2">
                  <button
                    className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-[15px] rounded-xl border border-solid border-[#FFC670]"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-[#FFC670] text-xs">{"Pending"}</span>
                  </button>
                  <button
                    className="flex flex-col shrink-0 items-start bg-[#FF5269] text-left py-1.5 px-2.5 rounded-xl border-0"
                    onClick={() => alert("Pressed!")}
                  >
                    <span className="text-white text-xs">{"Preparing"}</span>
                  </button>
                  <button
                    className="flex flex-1 justify-center items-center bg-emerald-500 text-left py-1.5 gap-1 rounded-[14px] border-0"
                    style={{
                      boxShadow: "0px 1px 2px #0000001A",
                    }}
                    onClick={() => alert("Pressed!")}
                  >
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/ihwnaqcz_expires_30_days.png"
                      }
                      className="w-3.5 h-3.5 rounded-[14px] object-fill"
                    />
                    <span className="text-white text-xs">{"Mark Ready"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col self-stretch mb-5 gap-[11px]">
          <div className="flex items-center self-stretch gap-2">
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/l11ihhpm_expires_30_days.png"
              }
              className="w-4 h-4 object-fill"
            />
            <span className="text-[#101828] text-base font-bold">
              {"Pending Orders"}
            </span>
          </div>
          <div className="flex items-center self-stretch gap-3">
            <div
              className="flex flex-1 flex-col items-start bg-white py-[23px] pr-5 rounded-2xl border border-solid border-gray-100"
              style={{
                boxShadow: "0px 1px 2px #0000001A",
              }}
            >
              <div className="flex justify-between items-center self-stretch mb-3 ml-5">
                <div className="flex shrink-0 items-center gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#101828] text-base font-bold">
                      {"#R-4823"}
                    </span>
                  </div>
                  <button
                    className="flex shrink-0 items-center bg-gray-100 text-left py-0.5 px-2.5 gap-1 rounded-[26843500px] border border-solid border-gray-200"
                    onClick={() => alert("Pressed!")}
                  >
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/rn6391fh_expires_30_days.png"
                      }
                      className="w-3 h-3 rounded-[26843500px] object-fill"
                    />
                    <span className="text-[#364153] text-xs">{"Pending"}</span>
                  </button>
                </div>
                <div className="flex shrink-0 items-center bg-green-50 py-1 px-2.5 gap-[3px] rounded-[10px]">
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/oieoi08j_expires_30_days.png"
                    }
                    className="w-3.5 h-3.5 rounded-[10px] object-fill"
                  />
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#00A63E] text-xs font-bold">
                      {"3:22"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-[13px] ml-5 gap-[9px]">
                <div className="flex flex-col shrink-0 items-start">
                  <span className="text-[#6A7282] text-xs">{"Counter 1"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start">
                  <span className="text-[#6A7282] text-xs">{"•"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start">
                  <span className="text-[#6A7282] text-xs">{"Dine-in"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start">
                  <span className="text-[#6A7282] text-xs">{"•"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start">
                  <span className="text-[#6A7282] text-xs">
                    {"28% of target time"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col self-stretch mb-9 ml-5 gap-[9px]">
                <div className="flex items-center self-stretch gap-[9px]">
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/y4f0bf0l_expires_30_days.png"
                    }
                    className="w-10 h-10 object-fill"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#101828] text-xs font-bold">
                        {"Beef Tapa"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#6A7282] text-[11px]">
                        {"Well done"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch gap-[9px]">
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/hwknoei3_expires_30_days.png"
                    }
                    className="w-10 h-10 object-fill"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#101828] text-xs font-bold">
                        {"Garlic Rice"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#6A7282] text-[11px]">
                        {"Medium serving"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start relative">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/3hzvogqe_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div
                      className="flex flex-col items-start bg-[#00000000] absolute top-0 right-0 pb-1 px-1.5 rounded-[26843500px]"
                      style={{
                        boxShadow: "0px 2px 4px #0000001A",
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-white text-[11px] font-bold">
                          {"2"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#101828] text-xs font-bold">
                        {"Fried Egg"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#6A7282] text-[11px]">
                        {"Over easy"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center self-stretch ml-5 gap-2">
                <button
                  className="flex flex-col shrink-0 items-start bg-[#FFD77A] text-left py-1.5 px-[15px] rounded-xl border-0"
                  onClick={() => alert("Pressed!")}
                >
                  <span className="text-[#2D2D2D] text-xs">{"Pending"}</span>
                </button>
                <button
                  className="flex flex-col shrink-0 items-start bg-[#FFEFEF] text-left py-1.5 px-2.5 rounded-xl border border-solid border-[#EB1313]"
                  onClick={() => alert("Pressed!")}
                >
                  <span className="text-[#EB1313] text-xs">{"Preparing"}</span>
                </button>
                <button
                  className="flex flex-1 justify-center items-center bg-emerald-500 text-left py-1.5 gap-1 rounded-[14px] border-0"
                  style={{
                    boxShadow: "0px 1px 2px #0000001A",
                  }}
                  onClick={() => alert("Pressed!")}
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/31nf3khq_expires_30_days.png"
                    }
                    className="w-3.5 h-3.5 rounded-[14px] object-fill"
                  />
                  <span className="text-white text-xs">{"Mark Ready"}</span>
                </button>
              </div>
            </div>
            <div
              className="flex-1 bg-white py-[21px] px-5 rounded-2xl border border-solid border-gray-100"
              style={{
                boxShadow: "0px 1px 2px #0000001A",
              }}
            >
              <div className="flex justify-between items-center self-stretch mb-3">
                <div className="flex shrink-0 items-center gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#101828] text-base font-bold">
                      {"#R-4826"}
                    </span>
                  </div>
                  <button
                    className="flex shrink-0 items-center bg-gray-100 text-left py-0.5 px-2.5 gap-1 rounded-[26843500px] border border-solid border-gray-200"
                    onClick={() => alert("Pressed!")}
                  >
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/54ltczqr_expires_30_days.png"
                      }
                      className="w-3 h-3 rounded-[26843500px] object-fill"
                    />
                    <span className="text-[#364153] text-xs">{"Pending"}</span>
                  </button>
                </div>
                <div className="flex shrink-0 items-center bg-orange-50 py-1 px-2.5 gap-[3px] rounded-[10px]">
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/vm42d7wf_expires_30_days.png"
                    }
                    className="w-3.5 h-3.5 rounded-[10px] object-fill"
                  />
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#F54900] text-xs font-bold">
                      {"4:22"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center self-stretch mb-[13px]">
                <div className="flex flex-col shrink-0 items-start mr-[9px]">
                  <span className="text-[#6A7282] text-xs">{"Counter 3"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start mr-[9px]">
                  <span className="text-[#6A7282] text-xs">{"•"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start mr-2">
                  <span className="text-[#6A7282] text-xs">{"Takeout"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start mr-[9px]">
                  <span className="text-[#6A7282] text-xs">{"•"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start">
                  <span className="text-[#6A7282] text-xs">
                    {"72% of target time"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col self-stretch mb-[11px] gap-[9px]">
                <div className="flex items-center self-stretch gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start relative">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/i63mscj0_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div
                      className="flex flex-col items-start bg-[#00000000] absolute top-0 right-0 pb-1 px-1.5 rounded-[26843500px]"
                      style={{
                        boxShadow: "0px 2px 4px #0000001A",
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-white text-[11px] font-bold">
                          {"2"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#101828] text-xs font-bold">
                        {"Halo-Halo"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#6A7282] text-[11px]">
                        {"Extra ice cream"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center self-stretch gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start relative">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/pgd9elcn_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div
                      className="flex flex-col items-start bg-[#00000000] absolute top-0 right-0 pb-1 px-1.5 rounded-[26843500px]"
                      style={{
                        boxShadow: "0px 2px 4px #0000001A",
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-white text-[11px] font-bold">
                          {"3"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#101828] text-xs font-bold">
                        {"Turon"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#6A7282] text-[11px]">
                        {"With langka"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="flex items-start self-stretch bg-[#00000000] py-[11px] px-3 mb-[13px] gap-[7px] rounded-[14px] border border-solid border-orange-400"
                style={{
                  boxShadow: "0px 1px 2px #0000001A",
                }}
              >
                <img
                  src={
                    "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/j8wqbygw_expires_30_days.png"
                  }
                  className="w-5 h-5 object-fill"
                />
                <div className="flex flex-1 flex-col gap-[1px]">
                  <div className="flex items-center self-stretch gap-1">
                    <div className="bg-orange-400 w-1 h-1 rounded-[26843500px]"></div>
                    <span className="text-orange-400 text-[10px] font-bold">
                      {"AI Special Instructions"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start self-stretch">
                    <span className="text-amber-800 text-xs">
                      {"Customer prefers less ice on Halo-Halo"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center self-stretch py-1.5 gap-2">
                <button
                  className="flex flex-col shrink-0 items-start bg-[#FFD77A] text-left py-1.5 px-[15px] rounded-xl border-0"
                  onClick={() => alert("Pressed!")}
                >
                  <span className="text-[#2D2D2D] text-xs">{"Pending"}</span>
                </button>
                <button
                  className="flex flex-col shrink-0 items-start bg-[#FFEFEF] text-left py-1.5 px-2.5 rounded-xl border border-solid border-[#EB1313]"
                  onClick={() => alert("Pressed!")}
                >
                  <span className="text-[#EB1313] text-xs">{"Preparing"}</span>
                </button>
                <button
                  className="flex flex-1 justify-center items-center bg-emerald-500 text-left py-1.5 gap-1 rounded-[14px] border-0"
                  style={{
                    boxShadow: "0px 1px 2px #0000001A",
                  }}
                  onClick={() => alert("Pressed!")}
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/i1eqt00h_expires_30_days.png"
                    }
                    className="w-3.5 h-3.5 rounded-[14px] object-fill"
                  />
                  <span className="text-white text-xs">{"Mark Ready"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col self-stretch gap-[11px]">
          <div className="flex items-center self-stretch gap-2">
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/y5g4kqyo_expires_30_days.png"
              }
              className="w-4 h-4 object-fill"
            />
            <span className="text-[#101828] text-base font-bold">
              {"Ready for Pickup"}
            </span>
          </div>
          <div className="flex flex-col items-start self-stretch">
            <div
              className="flex flex-col items-start bg-white py-[21px] px-5 rounded-2xl border border-solid border-gray-100"
              style={{
                boxShadow: "0px 1px 2px #0000001A",
              }}
            >
              <div className="flex items-center mb-3">
                <div className="flex shrink-0 items-center mr-[305px] gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#101828] text-base font-bold">
                      {"#R-4824"}
                    </span>
                  </div>
                  <button
                    className="flex shrink-0 items-center bg-[#10B9811A] text-left py-[3px] px-2.5 gap-1 rounded-[26843500px] border border-solid border-emerald-200"
                    onClick={() => alert("Pressed!")}
                  >
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/q7znd6yj_expires_30_days.png"
                      }
                      className="w-3 h-3 rounded-[26843500px] object-fill"
                    />
                    <span className="text-emerald-500 text-xs">{"Ready"}</span>
                  </button>
                </div>
                <div className="flex shrink-0 items-center bg-red-50 py-1 px-2.5 gap-[3px] rounded-[10px]">
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/ijzvmrvt_expires_30_days.png"
                    }
                    className="w-3.5 h-3.5 rounded-[10px] object-fill"
                  />
                  <div className="flex flex-col shrink-0 items-start">
                    <span className="text-[#E7000B] text-xs font-bold">
                      {"17:22"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-[13px]">
                <div className="flex flex-col shrink-0 items-start mr-[9px]">
                  <span className="text-[#6A7282] text-xs">{"Counter 4"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start mr-[9px]">
                  <span className="text-[#6A7282] text-xs">{"•"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start mr-[9px]">
                  <span className="text-[#6A7282] text-xs">{"Dine-in"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start mr-[9px]">
                  <span className="text-[#6A7282] text-xs">{"•"}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start mr-[272px]">
                  <span className="text-[#6A7282] text-xs">
                    {"144% of target time"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start mb-[11px] gap-[9px]">
                <div className="flex items-center gap-[9px]">
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/utm4yok4_expires_30_days.png"
                    }
                    className="w-10 h-10 object-fill"
                  />
                  <div className="flex flex-col shrink-0 items-start">
                    <div className="flex flex-col items-start pr-[376px]">
                      <span className="text-[#101828] text-xs font-bold">
                        {"Sisig Rice Bowl"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start pr-[391px]">
                      <span className="text-[#6A7282] text-[11px]">
                        {"Medium spice"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start relative">
                    <img
                      src={
                        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/ytebmt5q_expires_30_days.png"
                      }
                      className="w-10 h-10 object-fill"
                    />
                    <div
                      className="flex flex-col items-start bg-[#00000000] absolute top-0 right-0 pb-1 px-1.5 rounded-[26843500px]"
                      style={{
                        boxShadow: "0px 2px 4px #0000001A",
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-white text-[11px] font-bold">
                          {"2"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col shrink-0 items-start">
                    <div className="flex flex-col items-start pr-[368px]">
                      <span className="text-[#101828] text-xs font-bold">
                        {"Calamansi Juice"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start pr-[406px]">
                      <span className="text-[#6A7282] text-[11px]">
                        {"Less sugar"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="flex items-start bg-[#00000000] py-[11px] px-3 mb-3 gap-[7px] rounded-[14px] border border-solid border-orange-400"
                style={{
                  boxShadow: "0px 1px 2px #0000001A",
                }}
              >
                <img
                  src={
                    "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/fhd32r2x_expires_30_days.png"
                  }
                  className="w-5 h-5 object-fill"
                />
                <div className="flex flex-col shrink-0 items-start gap-[1px]">
                  <div className="flex items-center">
                    <div className="bg-orange-400 w-1 h-1 mr-1 rounded-[26843500px]"></div>
                    <span className="text-orange-400 text-[10px] font-bold mr-[314px]">
                      {"AI Special Instructions"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start pr-[188px]">
                    <span className="text-amber-800 text-xs">
                      {"Extra spicy as requested - customer is a regular"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center py-[5px] gap-2">
                <button
                  className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-[15px] rounded-xl border border-solid border-[#FFC670]"
                  onClick={() => alert("Pressed!")}
                >
                  <span className="text-[#FFC670] text-xs">{"Pending"}</span>
                </button>
                <button
                  className="flex flex-col shrink-0 items-start bg-[#FFEFEF] text-left py-1.5 px-2.5 rounded-xl border border-solid border-[#EB1313]"
                  onClick={() => alert("Pressed!")}
                >
                  <span className="text-[#EB1313] text-xs">{"Preparing"}</span>
                </button>
                <button
                  className="flex shrink-0 items-center bg-emerald-500 text-left py-2 px-[134px] gap-1 rounded-[14px] border border-solid border-emerald-500"
                  style={{
                    boxShadow: "0px 2px 4px #0000001A",
                  }}
                  onClick={() => alert("Pressed!")}
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nTVjCOahcp/y1lvairj_expires_30_days.png"
                    }
                    className="w-3.5 h-3.5 rounded-[14px] object-fill"
                  />
                  <span className="text-white text-xs">{"Completed"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
