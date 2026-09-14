"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function CanadaFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      className={cn("h-full w-full object-cover rounded-full shadow-inner", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="250" height="500" fill="#D80027" />
      <rect x="250" width="500" height="500" fill="#FFFFFF" />
      <rect x="750" width="250" height="500" fill="#D80027" />
      <path
        fill="#D80027"
        d="m500 50 20 68 45-25-10 65 65 5-28 48 48 30-70 24 5 35-45-10 10 30-30-5-10 80h-20l-10-80-30 5 10-30-45 10 5-35-70-24 48-30-28-48 65-5-10-65 45 25z"
      />
    </svg>
  );
}

export function CoinLogo({
  src,
  symbol,
  className,
  imageClassName,
}: {
  src?: string;
  symbol: string;
  className?: string;
  imageClassName?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const isCad = symbol?.toUpperCase() === "CAD" || symbol?.toUpperCase() === "CADUSDT";

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      {isCad ? (
        <CanadaFlagIcon className={imageClassName} />
      ) : src && !failed ? (
        <img
          src={src}
          alt={`${symbol} logo`}
          className={cn("h-full w-full object-contain", imageClassName)}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xs font-black text-[#113285]">{symbol.slice(0, 1)}</span>
      )}
    </span>
  );
}
