"use client";

import React, { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Badge } from "@/components/atoms/Badge";
import { Mail, Lock, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/** Decode a JWT payload for client-side inspection only; this does not verify the token or its claims. */
function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(paddedBase64));
  } catch {
    return {};
  }
}

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Simple email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const vectorStyle =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[6.521deg] overflow-visible";

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Reset errors
    setError(null);
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;

    // Validate Email
    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError(true);
      hasError = true;
    }

    // Validate Password
    if (!password) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient(rememberMe);

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError || !signInData.user || !signInData.session) {
        setError(signInError?.message ?? "Invalid email or password.");
        return;
      }

      // Prefer claims injected by Supabase's custom_access_token_hook —
      // avoids an extra DB round-trip and removes dependency on RLS being
      // configured on the profiles table.
      const claims = decodeJwtPayload(signInData.session.access_token);
      const jwtRole = claims.user_role as string | undefined;
      const jwtTenantId = claims.tenant_id as string | undefined;

      if (jwtRole === "super_admin") {
        router.push("/admin/dashboard");
        return;
      }
      if (jwtRole && jwtTenantId) {
        router.push(`/${jwtTenantId}/dashboard`);
        return;
      }

      // Fallback: query the profiles table (requires RLS policy allowing
      // authenticated users to SELECT their own row).
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, tenant_id")
        .eq("id", signInData.user.id)
        .single();

      if (profileError || !profile) {
        setError(
          "Could not load your account profile. Please contact support.",
        );
        return;
      }

      if (profile.role === "super_admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(`/${profile.tenant_id}/dashboard`);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void handleSubmit();
    }
  };

  const isFormEmpty = !email || !password;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#FFD77A] from-0% via-white via-75% to-[#FFD77A] to-100% overflow-hidden px-4 md:px-0">
      <a
        onClick={() => router.push("/")}
        className="absolute top-10 right-10 z-50 p-2 rounded-full hover:scale-120 transition-all duration-200 group cursor-pointer"
        aria-label="Close"
      >
        <X
          size={28}
          className="text-text-primary group-hover:scale-110 group-active:scale-95 transition-transform"
        />
      </a>

      {/* Background Vectors (Rotating) */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-end pointer-events-none opacity-60">
        <div
          className="relative shrink-0 -mr-[200px] md:-mr-[400px]"
          style={{ transform: "scale(1.5)" }}
        >
          <div
            className="opacity-50 overflow-visible animate-[spin_300s_linear_infinite]"
            style={{
              width: "1148.236px",
              height: "969.879px",
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
                strokeOpacity="1"
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
                strokeOpacity="1"
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
                strokeOpacity="1"
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
                strokeOpacity="1"
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
                strokeOpacity="1"
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
                strokeOpacity="1"
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
                strokeOpacity="1"
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
                strokeOpacity="1"
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
                strokeOpacity="1"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* Big Qios Background Word */}
      <div className="absolute bottom-0 -left-10 md:-left-20 lg:left-10 z-0 pointer-events-none select-none">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(0deg, #FFD77A -11.44%, #FFF 100%)",
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 -top-[900px] z-1 pointer-events-none opacity-60"
          style={{
            width: "1598px",
            height: "1204px",
            background: "var(--color-text-tertiary)",
            filter: "blur(150px)",
            borderRadius: "1598px",
          }}
        />

        <div className="absolute -left-6 md:-left-8 lg:-left-10 -bottom-20 md:-bottom-32 lg:-bottom-36 z-2 pointer-events-none select-none overflow-hidden">
          <h1
            className="font-ibrand text-[min(50vw,500px)] md:text-[min(45vw,500px)]"
            style={{
              fontWeight: 400,
              lineHeight: "1",
              background:
                "linear-gradient(to bottom right, #FFD77A 0%, #FF5269 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #FFD77A 0%, #FF5269 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #FFD77A 0%, #FF5269 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #FFD77A 0%, #FF5269 50%) top right / 50% 50% no-repeat",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Qios
          </h1>
        </div>
      </div>
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-text-primary">
              Welcome back
            </h1>
            <p className="b4 text-text-secondary mt-1">
              Please enter your details to sign in
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <FormField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
              if (emailError) setEmailError(false);
            }}
            onKeyDown={handleKeyDown}
            isError={emailError || !!error}
            supportiveText={
              emailError
                ? !email.trim()
                  ? "Email is required"
                  : "Invalid email format"
                : undefined
            }
            leftIcon={<Mail size={20} />}
            className="max-w-full"
          />

          <FormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
              if (passwordError) setPasswordError(false);
            }}
            onKeyDown={handleKeyDown}
            isError={passwordError || !!error}
            supportiveText={passwordError ? "Password is required" : undefined}
            leftIcon={<Lock size={20} />}
            className="max-w-full"
          />

          {/* Additional Options */}
          <div className="flex items-center justify-between pt-1">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <button
              type="button"
              className="b4 font-bold text-brand-primary hover:text-brand-accent transition-colors focus:outline-none"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button & Error */}
          <div className="pt-2 flex flex-col gap-3">
            {error && (
              <Badge
                color="error"
                variant="outline"
                shape="rounded"
                leftIcon={<AlertCircle size={16} className="shrink-0" />}
                className="w-full justify-center whitespace-normal text-center py-2 animate-in fade-in zoom-in-95"
              >
                {error}
              </Badge>
            )}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full h-[52px]"
              disabled={isFormEmpty || isLoading}
              loading={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
