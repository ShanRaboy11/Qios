import React from "react";
import { Button } from "@/components/atoms/Button";
import { Navbar } from "@/components/organisms/navbar";

export const Hero = () => {
  const vectorStyle =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[6.521deg] overflow-visible";

  const gradientHeaderStyle = {
    background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <section className="w-full max-w-[1440px] min-h-screen xl:min-h-0 h-auto xl:h-[900px] pb-24 xl:pb-0 bg-text-tertiary flex items-center justify-start mx-auto relative z-[10]">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[100vw] flex justify-center z-[100]">
        <div className="w-full">
          <Navbar variant="transparent" />
        </div>
      </div>

      <div className="w-full flex flex-col md:grid md:grid-cols-[max-content_1fr] gap-y-16 md:gap-y-[100px] lg:gap-y-[120px] xl:gap-y-16 md:gap-x-8 lg:gap-x-12 px-6 md:px-12 xl:px-0 xl:contents mt-32 md:mt-16 lg:mt-20 xl:mt-0 relative z-[70] items-center md:items-start">
        {/* contents */}
        <div className="col-start-1 row-start-1 flex justify-center md:justify-start xl:contents md:pl-4 lg:pl-8 xl:pl-0">
          <div className="relative xl:absolute left-auto xl:left-[-150px] top-auto xl:top-[48%] translate-y-0 xl:-translate-y-1/2 z-[70] flex flex-col justify-between w-full max-w-[400px] md:max-w-none md:w-[369px] xl:w-[369px] h-auto xl:h-[371px] items-center text-center md:items-start md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <p className="b3 text-brand-primary mb-3 w-full md:w-[359px] xl:w-[359px]">
                THE FUTURE OF CEBU F&B
              </p>
              <h1
                className="h1 bg-clip-text text-transparent mb-4 w-full md:w-[369px] xl:w-[369px]"
                style={gradientHeaderStyle}
              >
                No Kiosk Hardware, Just Smarter Orders
              </h1>
              <p className="b1 text-text-primary w-full md:w-[359px] xl:w-[359px] h-auto xl:h-[88px]">
                Reduce counter congestion with AI-powered QR ordering and
                real-time inventory control. Save thousands on hardware costs.
              </p>
            </div>

            <div className="flex gap-4 mt-8 xl:mt-0">
              <Button variant="accent">Schedule a Demo</Button>
              <Button
                variant="outline"
                className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:border-brand-accent hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* mockups */}
        <div className="hidden md:flex xl:contents col-start-2 row-start-1 justify-start items-center w-full">
          <div className="relative xl:absolute w-0 h-0 xl:w-auto xl:h-auto z-[65] top-auto xl:top-[110px] left-0 md:left-[-100px] lg:left-[-60px] xl:left-[480px] scale-[0.45] md:scale-[0.48] lg:scale-[0.58] xl:scale-100 origin-left xl:origin-top-left pointer-events-none xl:pointer-events-auto">
            {/* ipad mockup base */}
            <img
              src="ipad.svg"
              alt="iPad Mockup"
              className="relative z-10 block max-w-none"
            />

            <div
              className="absolute z-20 overflow-hidden"
              style={{
                top: "99px",
                left: "47px",
                width: "706.635px",
                height: "489.599px",
                transform: "rotate(-3.781deg)",
                transformOrigin: "top left",
                borderRadius: "20px",
              }}
            >
              <img
                src="ipad-dashboard.svg"
                alt="Dashboard Content"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  backgroundColor: "white",
                }}
                className="block max-w-none"
              />
            </div>

            {/* ipad shadows */}
            <div
              className="hidden xl:block absolute z-30"
              style={{
                width: "112.027px",
                height: "381.789px",
                transform: "rotate(-8.906deg)",
                borderRadius: "300px",
                background: "rgba(145, 101, 107, 0.27)",
                filter: "blur(75px)",
                bottom: "50px",
                right: "210px",
              }}
            />
            <div
              className="hidden xl:block absolute z-30"
              style={{
                width: "70.998px",
                height: "241.96px",
                transform: "rotate(-8.906deg)",
                borderRadius: "300px",
                background: "rgba(145, 101, 107, 0.27)",
                filter: "blur(20px)",
                bottom: "90px",
                right: "230px",
              }}
            />

            {/* tablet-only phone mockup */}
            <div
              className="hidden md:block xl:hidden absolute z-[80]"
              style={{
                left: "630px",
                top: "110px",
                width: "450px",
                height: "612px",
              }}
            >
              <img
                src="phone.svg"
                alt="Phone Mockup"
                style={{ width: "100%", height: "100%" }}
                className="block max-w-none"
              />
              <div
                className="absolute z-20 overflow-hidden"
                style={{
                  top: "47px",
                  left: "96px",
                  width: "211px",
                  height: "456px",
                  transform: "rotate(11.817deg)",
                  transformOrigin: "top left",
                  borderRadius: "20px",
                }}
              >
                <img
                  src="phone-dashboard.svg"
                  alt="Phone Dashboard Content"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    backgroundColor: "white",
                  }}
                  className="block max-w-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* analytics */}
        <div className="col-start-1 row-start-2 flex justify-center md:justify-start xl:contents md:pl-4 lg:pl-8 xl:pl-0">
          <div className="relative xl:absolute bottom-auto xl:bottom-12 left-auto xl:left-[-150px] z-[60] flex flex-row flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-8 md:gap-6 lg:gap-8 xl:gap-[25px] w-full md:w-max xl:w-auto">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-[4px] w-[120px] md:w-[135px] lg:w-[145px] xl:w-[129px]">
              <h2
                className="font-figtree text-[39px] md:text-[34px] lg:text-[36px] xl:text-[39px] font-semibold leading-normal bg-clip-text text-transparent"
                style={gradientHeaderStyle}
              >
                50+
              </h2>
              <p className="text-text-primary font-inter text-[16px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-normal leading-normal">
                Cebu F&B establishments
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-[4px] w-[130px] md:w-[155px] lg:w-[160px] xl:w-[142px]">
              <h2
                className="font-figtree text-[39px] md:text-[34px] lg:text-[36px] xl:text-[39px] font-semibold leading-normal bg-clip-text text-transparent"
                style={gradientHeaderStyle}
              >
                40%
              </h2>
              <p className="text-text-primary font-inter text-[16px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-normal leading-normal">
                average reduction in wait times
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-[4px] w-[130px] md:w-[155px] lg:w-[160px] xl:w-[142px]">
              <h2
                className="font-figtree text-[39px] md:text-[34px] lg:text-[36px] xl:text-[39px] font-semibold leading-normal bg-clip-text text-transparent"
                style={gradientHeaderStyle}
              >
                ₱50K+
              </h2>
              <p className="text-text-primary font-inter text-[16px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-normal leading-normal">
                saved on hardware costs
              </p>
            </div>
          </div>
        </div>

        {/* logo carousels */}
        <div className="col-start-2 row-start-2 flex justify-center md:justify-start xl:contents w-full overflow-hidden md:overflow-visible">
          <div
            className="relative xl:absolute bottom-auto xl:bottom-12 right-auto xl:right-[-150px] w-full md:w-[350px] lg:w-[480px] xl:w-[950px] overflow-hidden z-[60] bg-transparent pointer-events-none mt-4 md:mt-0 md:ml-8 lg:ml-12 xl:ml-0 md:mr-4 lg:mr-6 xl:mr-0"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div className="animate-infinite-scroll gap-8 md:gap-16 items-center pr-8 md:pr-16">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg"
                    alt="Starbucks"
                    className="h-10 md:h-16 w-auto object-contain shrink-0"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg"
                    alt="McDonald's"
                    className="h-8 md:h-12 w-auto object-contain shrink-0"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/3/32/Wendy%27s_full_logo_2012.svg"
                    alt="Wendy's"
                    className="h-8 md:h-12 w-auto object-contain shrink-0"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Burger_King_2020.svg"
                    alt="Burger King"
                    className="h-8 md:h-12 w-auto object-contain shrink-0"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg"
                    alt="Subway"
                    className="h-6 md:h-8 w-auto object-contain shrink-0"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/02/Chick-fil-A_Logo.svg"
                    alt="Chick-fil-A"
                    className="h-6 md:h-8 w-auto object-contain shrink-0"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Domino%27s_pizza_logo.svg"
                    alt="Domino's"
                    className="h-8 md:h-12 w-auto object-contain shrink-0"
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* desktop phone mockup */}
      <div
        className="hidden xl:block absolute z-[80]"
        style={{
          left: "1110px",
          top: "220px",
          width: "450px",
          height: "612px",
        }}
      >
        <img
          src="phone.svg"
          alt="Phone Mockup"
          style={{ width: "100%", height: "100%" }}
        />
        <div
          className="absolute z-20 overflow-hidden"
          style={{
            top: "47px",
            left: "96px",
            width: "211px",
            height: "456px",
            transform: "rotate(11.817deg)",
            transformOrigin: "top left",
            borderRadius: "20px",
          }}
        >
          <img
            src="phone-dashboard.svg"
            alt="Phone Dashboard Content"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              backgroundColor: "white",
            }}
          />
        </div>
      </div>

      {/* vectors */}
      <div
        className="relative shrink-0 opacity-50 -ml-[400px]"
        style={{
          width: "1148.236px",
          height: "969.879px",
          transform: "rotate(-6.521deg) scale(1.075)",
        }}
      >
        <svg
          className={vectorStyle}
          style={{ width: "1042.004px", height: "788.681px" }}
          viewBox="0 0 758 823"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M359.571 446.233C342.914 434.14 334.103 419.712 340.619 398.512C362.742 326.978 436.795 267.944 421.702 189.12C413.898 148.649 379.943 112.831 331.565 85.1615C102.725 -45.3288 -112.713 6.65592 -177.691 43.3137C-244.286 80.8642 -208.584 155.774 -173.522 204.454C-130.355 264.445 -75.6605 324.382 -69.361 389.956C-62.7223 459.193 -29.6821 617.07 14.4358 685.987C45.5628 734.609 122.809 802.806 200.619 811.699C278.429 820.593 354.88 772.413 413.725 742.99C472.569 713.566 718.693 857.298 746.355 811.575C783.548 750.091 701.012 672.472 641.821 622.7C581.798 572.244 512.262 526.775 436.709 486.203C408.707 471.246 378.883 460.294 359.571 446.233Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1032.697px", height: "805.617px" }}
          viewBox="0 0 735 838"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-187.615 36.8565C-258.582 76.8463 -220.418 156.74 -183.144 208.612C-137.243 272.54 -78.7571 336.437 -72.1957 406.351C-65.1676 480.139 -45.1082 632.222 1.976 705.691C35.1545 757.584 117.155 823.973 200.202 833.465C274.421 841.949 347.183 799.519 404.915 773.201C464.403 746.104 687.378 869.557 718.675 826.502C761.872 766.88 698.544 690.967 651.605 638.774C604.538 586.371 544.838 538.401 476.566 495.134C451.262 479.114 423.871 466.775 405.268 451.815C389.287 439.114 380.049 424.441 383.473 403.77C388.701 372.626 400.357 343.589 410.173 314.733C418.595 290.127 425.498 265.543 424.996 239.426C424.776 226.764 422.184 213.634 417.264 199.65C403.719 161.658 367.974 126.909 317.89 98.2606C243.455 55.8565 170.428 28.9939 102.381 14.2605C-25.1228 -13.4407 -137.382 8.506 -187.615 36.8565Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1025.141px", height: "824.734px" }}
          viewBox="0 0 714 860"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-197.688 32.0703C-273.027 74.4994 -232.55 159.36 -192.915 214.441C-144.131 282.323 -82.1521 350.146 -75.0296 424.435C-67.6122 502.774 -60.5446 649.159 -10.6437 727.162C24.5974 782.23 111.491 846.925 199.476 856.982C270.253 865.072 339.337 828.296 395.795 805.163C456.077 780.41 656.041 883.696 690.537 843.163C739.885 785.419 695.456 711.275 660.918 656.679C626.498 602.39 577.093 551.875 516.102 505.913C493.636 488.944 468.677 475.217 450.644 459.245C435.35 445.838 425.547 430.807 425.868 410.76C426.368 379.86 430.272 351.015 432.003 322.607C433.536 298.584 433.656 274.988 427.729 249.917C424.844 238.027 419.608 225.477 412.356 212.01C393.508 176.646 355.386 142.8 303.893 113.207C231.626 71.7364 160.493 41.5635 92.3891 22.0233C-25.8949 -12.0695 -140.49 -0.186471 -197.688 32.0703Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1020.906px", height: "845.754px" }}
          viewBox="0 0 698 880"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-207.762 24.0507C-287.483 69.0158 -244.683 158.746 -202.846 217.116C-151.179 288.952 -85.5694 360.815 -78.1741 439.348C-70.2176 522.255 -76.2804 662.829 -23.5629 745.366C13.7408 803.609 105.378 866.593 198.6 877.248C265.786 884.928 331.48 853.936 386.675 833.892C447.739 811.58 624.715 894.506 662.548 856.607C718.198 800.76 692.506 728.463 670.392 671.271C648.767 615.113 609.509 562.035 555.81 513.282C536.031 495.347 513.654 480.249 496.181 463.361C481.574 449.25 471.195 433.957 468.562 414.552C464.335 383.896 460.486 355.241 454.142 327.184C448.776 303.842 442.274 281.155 430.773 257.112C425.383 245.916 417.482 234.138 407.918 220.995C383.917 188.274 343.418 155.333 290.368 124.778C220.096 84.417 150.985 51.1444 82.7187 26.3934C-26.7666 -13.0615 -143.599 -12.1124 -207.762 24.0507Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1022.19px", height: "868.434px" }}
          viewBox="0 0 689 898"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-217.833 12.7109C-301.926 60.1152 -256.814 154.813 -212.615 216.391C-158.226 292.261 -88.9627 367.971 -81.0063 450.878C-72.6605 538.336 -91.715 673.212 -36.0202 760.204C3.33499 821.719 99.876 882.912 198.175 894.246C261.769 901.514 324.212 876.421 377.868 859.238C439.852 839.48 593.829 902.144 634.883 866.572C697.134 812.655 689.719 742.251 680.179 682.479C671.028 624.613 642.076 568.892 595.659 517.444C578.717 498.56 558.772 482.075 541.859 464.271C527.927 449.552 516.983 433.9 511.258 415.024C502.016 384.479 490.84 356.261 476.273 328.537C464.318 305.814 433.646 261.163 425.751 250.66 415.196 239.559 403.15 226.916C374.306 196.776 330.97 164.784 276.512 133.285C208.247 93.9367 141.102 58.0478 72.7066 27.796C-27.8525 -16.8105 -146.545 -27.4381 -217.833 12.7109Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1032.116px", height: "892.45px" }}
          viewBox="0 0 692 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-227.907 1.37089C-316.372 51.2145 -268.947 150.879 -222.386 215.666C-165.114 295.491 -92.2089 375.143 -83.9796 462.294C-75.2444 554.303 -107.429 683.368 -48.7793 775.008C-7.36156 839.697 93.9227 899.18 197.459 911.112C257.462 917.97 316.653 898.775 368.759 884.549C431.813 867.363 562.802 909.668 606.755 876.583C675.745 824.709 686.17 756.051 689.503 693.733C692.676 634.141 674.181 575.795 635.067 521.459C620.801 501.705 603.45 483.753 587.256 464.954C574.001 449.626 562.342 433.598 553.813 415.381C539.544 385.046 521.225 356.991 498.262 329.777C479.707 307.769 459.661 286.864 436.539 265.02C426.289 255.228 413.241 244.723 398.562 232.563C365.186 204.943 318.841 174.076 262.687 141.501C196.428 103.166 130.757 64.9965 62.5866 28.7945C-29.4561 -20.0308 -149.654 -42.6844 -227.907 1.37089Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1057.114px", height: "917.508px" }}
          viewBox="0 0 709 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-237.842 -9.85518C-330.678 42.4277 -280.93 146.962 -232.157 214.941C-172.002 298.72 -95.6042 382.298 -86.8138 473.824C-77.5396 570.401 -122.855 693.654 -61.3881 789.829C-17.9079 857.693 88.2582 915.578 196.743 927.978C253.305 934.443 309.084 921.226 359.65 909.861C423.764 895.343 531.914 917.305 578.777 886.61C654.645 836.894 682.782 769.771 698.988 704.908C714.347 643.476 706.459 582.521 674.775 525.508C663.197 504.787 648.278 485.448 632.793 465.75C620.225 449.717 607.839 433.41 596.506 415.853C577.062 385.71 551.888 357.949 520.402 331.034C495.257 309.645 468.451 289.535 439.583 268.895C426.828 259.796 411.286 249.888 393.964 238.307C356.227 213.029 306.563 183.351 249.012 149.734C184.76 112.413 120.08 72.2011 52.7554 29.9239C-31.6908 -23.0293 -152.763 -57.9305 -237.842 -9.85518Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1091.294px", height: "943.52px" }}
          viewBox="0 0 733 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-247.915 -21.1954C-345.134 33.6236 -292.923 143.141 -241.789 214.329C-178.751 302.063 -98.7105 389.584 -89.6582 485.45C-79.9947 586.578 -138.302 704.134 -73.8687 804.861C-28.4866 875.979 82.5834 932.073 196.305 945.072C249.276 951.126 301.921 944.114 350.969 935.417C416.27 923.778 501.442 925.284 551.227 896.882C633.951 849.517 679.672 783.718 708.74 716.407C736.135 653.117 738.842 589.651 714.6 529.864C705.71 508.177 693.223 487.45 678.448 466.854C663.405 450.195 653.305 433.512 639.179 416.517C614.536 386.76 582.402 358.889 542.509 332.581C510.936 311.73 477.358 292.512 442.582 273.156C427.473 264.767 409.448 255.36 389.333 244.342C347.247 221.309 294.253 192.916 235.294 158.354C173.07 121.852 108.749 79.8206 42.9029 31.2465C-34.3957 -25.886 -155.87 -73.177 -247.915 -21.1954Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
        <svg
          className={vectorStyle}
          style={{ width: "1131.397px", height: "969.879px" }}
          viewBox="0 0 763 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M445.637 276.934C356.927 237.405 192.586 169.931 33.0605 32.473C-37.8607 -28.7309 -158.83 -88.4058 -257.988 -32.535C-359.579 24.7232 -305.056 139.208 -251.709 213.588C-185.938 305.258 -102.256 396.723 -92.6421 496.963C-82.4396 602.659 -153.877 714.404 -86.6274 819.665C-39.1827 893.958 76.7802 948.358 195.59 961.938C314.399 975.518 433.242 951.679 523.11 906.796C612.99 861.817 675.858 797.193 718.086 727.468C803.696 585.896 766.393 441.442 564.521 333.628C526.52 313.316 486.17 294.988 445.637 276.934Z"
            stroke="#FFC670"
            strokeOpacity="0.2"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* blushes */}
      <div
        className="absolute pointer-events-none overflow-visible"
        style={{
          width: "2163.001px",
          height: "1433px",
          left: "-106px",
          top: "-372px",
          filter: "blur(100px)",
          zIndex: -1,
        }}
      >
        <div
          style={{
            width: "966.548px",
            height: "966.548px",
            borderRadius: "966.548px",
            background: "#FFE5BE",
            position: "absolute",
            left: "620.04px",
            top: "270px",
          }}
        />
        <div
          style={{
            width: "966.548px",
            height: "966.548px",
            borderRadius: "966.548px",
            background: "#FFDF96",
            position: "absolute",
            left: "800.16px",
            top: "150px",
          }}
        />
        <div
          style={{
            width: "966.548px",
            height: "966.548px",
            borderRadius: "966.548px",
            background: "#FFBDC6",
            position: "absolute",
            left: "1070.8px",
            top: "55px",
          }}
        />
        <div
          style={{
            width: "450px",
            height: "450px",
            borderRadius: "450px",
            background: "#FFE6BF",
            position: "absolute",
            left: "-206px",
            top: "1000px",
          }}
        />
        <div
          style={{
            width: "189px",
            height: "189px",
            position: "absolute",
            left: "-135px",
            top: "1150px",
          }}
        >
          <svg
            width="155"
            height="115"
            viewBox="0 0 155 115"
            fill="none"
            className="w-full h-full"
          >
            <circle cx="70.5" cy="70.5" r="100.5" fill="#FFBEC7" />
          </svg>
        </div>
        <div
          style={{
            width: "459.256px",
            height: "774.76px",
            position: "absolute",
            left: "975.06px",
            top: "374px",
            opacity: 0.6,
          }}
        >
          <svg
            width="460"
            height="750"
            viewBox="0 0 460 750"
            fill="none"
            className="w-full h-full"
          >
            <path
              opacity="0.6"
              d="M188.43 132.557C202.965 0.707443 260.584 -34.0717 425.136 -23.1708C440.189 -15.3844 467.597 13.7885 456.8 68.1892C443.304 136.19 305.745 62.4792 305.745 94.6629C305.745 126.847 337.409 217.168 305.745 295.032C274.08 372.896 273.042 505.783 237.744 614.273C202.446 722.763 145.865 729.511 99.6655 743.527C62.7062 754.739 17.8221 748.199 0 743.527C101.223 697.328 73.1918 682.274 128.216 640.747C183.239 599.219 173.896 264.406 188.43 132.557Z"
              fill="#FFC670"
            />
          </svg>
        </div>
        <div
          style={{
            width: "966.548px",
            height: "966.548px",
            borderRadius: "966.548px",
            background: "#FFF0DA",
            position: "absolute",
            left: "1390.45px",
            top: "0px",
          }}
        />
      </div>

      <style>
        {`
      @keyframes infinite-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-infinite-scroll {
        display: flex;
        width: max-content;
        animation: infinite-scroll 25s linear infinite;
      }
    `}
      </style>
    </section>
  );
};
