"use client";

import Link, { useLinkStatus } from "next/link";
import { useState } from "react";

type IntentLinkProps = {
  href: string;
  className: string;
  children: React.ReactNode;
  active?: boolean;
  showPending?: boolean;
  align?: "center" | "start";
};

function PendingSpinner() {
  const { pending } = useLinkStatus();

  return (
    <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden="true">
      <span
        className={`h-3 w-3 rounded-full border border-[#d08b52]/40 border-t-[#d08b52] transition-opacity ${pending ? "opacity-100 animate-spin" : "opacity-0"}`}
      />
    </span>
  );
}

export function IntentLink({
  href,
  className,
  children,
  active = false,
  showPending = true,
  align = "center",
}: IntentLinkProps) {
  const [armed, setArmed] = useState(false);
  const alignmentClassName = align === "start" ? "items-start" : "items-center";

  if (active) {
    return (
      <span aria-current="page" className={`${className} flex ${alignmentClassName} justify-between gap-3`}>
        <span>{children}</span>
        {showPending ? <span className="h-4 w-4" aria-hidden="true" /> : null}
      </span>
    );
  }

  return (
    <Link
      href={href}
      prefetch={armed ? null : false}
      onMouseEnter={() => setArmed(true)}
      onFocus={() => setArmed(true)}
      onTouchStart={() => setArmed(true)}
      className={`${className} flex ${alignmentClassName} justify-between gap-3`}
    >
      <span>{children}</span>
      {showPending ? <PendingSpinner /> : null}
    </Link>
  );
}
