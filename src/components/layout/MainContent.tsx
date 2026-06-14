"use client";

import { usePathname } from "next/navigation";
import { isFocusRoute } from "@/lib/navigation/focus-routes";

type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const hideTabPadding = isFocusRoute(pathname);

  return (
    <main
      className={`flex-1 ${hideTabPadding ? "" : "pb-tab-bar md:pb-0"}`}
    >
      {children}
    </main>
  );
}
