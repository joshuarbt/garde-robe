"use client";

import { usePathname } from "next/navigation";
import { isFocusRoute } from "@/lib/navigation/focus-routes";
import { isTabBarRoute } from "@/lib/navigation/tab-bar-routes";

type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();

  let paddingClass = "";
  if (isFocusRoute(pathname)) {
    paddingClass = "pb-mobile-action-focus md:pb-0";
  } else if (isTabBarRoute(pathname)) {
    paddingClass = "pb-tab-bar md:pb-0";
  }

  return <main className={`flex-1 min-w-0 ${paddingClass}`.trim()}>{children}</main>;
}
