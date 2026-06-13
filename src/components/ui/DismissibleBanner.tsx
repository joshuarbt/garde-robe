"use client";

import { useState } from "react";

type DismissibleBannerProps = {
  message: string;
  className?: string;
};

export function DismissibleBanner({ message, className = "" }: DismissibleBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      className={`mb-6 flex items-start justify-between gap-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className}`.trim()}
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="shrink-0 text-amber-800 underline-offset-2 hover:underline"
        aria-label="Dismiss"
      >
        Dismiss
      </button>
    </div>
  );
}
