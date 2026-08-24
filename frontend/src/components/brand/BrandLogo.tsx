import React from "react";

interface BrandLogoProps {
  variant?: "header" | "footer";
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "header",
  className = "",
}) => {
  const isFooter = variant === "footer";

  return (
    <span
      className={`inline-flex items-center ${isFooter ? "gap-3.5" : "gap-2.5"} ${className}`}
      aria-label="Tanvo"
    >
      <span
        className={`relative block shrink-0 overflow-hidden bg-black ${
          isFooter ? "h-12 w-12" : "h-9 w-9"
        }`}
        aria-hidden="true"
      >
        <img
          src="/brand/tanvo-logo.png"
          alt=""
          draggable={false}
          className="pointer-events-none absolute max-w-none select-none"
          style={{ width: "190%", left: "-49%", top: "-31%" }}
        />
      </span>

      <span className="flex flex-col">
        <span
          className={`font-sans font-semibold leading-none tracking-[-0.045em] text-[#F5FAFF] ${
            isFooter ? "text-3xl" : "text-[1.35rem]"
          }`}
        >
          Tanvo
        </span>
        {isFooter ? (
          <span className="mt-1.5 text-[8px] font-sans font-normal tracking-[0.12em] text-[#8293AA]">
            Products. Platforms. Possibilities.
          </span>
        ) : null}
      </span>
    </span>
  );
};
